import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from './quote.service';
import { ShipmentService } from './shipment.service';
import { Rate, QuoteRequest, ShipmentRequest, ShippingOrderAddSvc } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  form: FormGroup;

  rates = signal<Rate[]>([]);
  selectedRate = signal<Rate | null>(null);
  quoteLoading = signal(false);
  shipmentLoading = signal(false);
  errorMessage = signal('');

  shipmentEnabled = computed(() => this.selectedRate() !== null && !this.shipmentLoading());

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private shipmentService: ShipmentService
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    const tomorrow = this.getTomorrowDate();
    return this.fb.group({
      scheduledShipDate: [tomorrow, Validators.required],
      scheduledShipTime: ['11:00', Validators.required],

      // From
      fromAttention: ['Sender', Validators.required],
      fromCompany: ['Sender', Validators.required],
      fromAddress1: ['9 Van der Graaf Crt', Validators.required],
      fromAddress2: [''],
      fromCity: ['Brampton', Validators.required],
      fromProvince: ['ON', Validators.required],
      fromPostal: ['L6T5E5', Validators.required],
      fromCountry: ['CA', Validators.required],
      fromPhone: ['877 373 9222'],
      fromEmail: ['info@eshipper.com'],

      // To
      toAttention: ['Recipient', Validators.required],
      toCompany: ['Recipient', Validators.required],
      toAddress1: ['3211 Grant McConachie Way', Validators.required],
      toAddress2: [''],
      toCity: ['Richmond', Validators.required],
      toProvince: ['BC', Validators.required],
      toPostal: ['V7B0A4', Validators.required],
      toCountry: ['CA', Validators.required],
      toPhone: ['604 207 7077'],
    });
  }

  onQuote(): void {
    if (this.form.invalid || this.quoteLoading()) {
      return;
    }

    console.log('Form Value:', this.form.value);

    this.errorMessage.set('');
    this.quoteLoading.set(true);
    this.selectedRate.set(null);
    this.rates.set([]);

    const request = this.buildQuoteRequest();

    this.quoteService.getQuotes(request).subscribe({
      next: (response) => {
        this.quoteLoading.set(false);
        if (response.rates && response.rates.length > 0) {
          this.rates.set(response.rates);
        } else {
          this.errorMessage.set('No shipping rates available for the selected shipment.');
        }
      },
      error: (error) => {
        this.quoteLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to retrieve quotes. Please try again.');
      }
    });
  }

  onShipment(): void {
    const rate = this.selectedRate();
    if (!rate || this.form.invalid || this.shipmentLoading()) {
      return;
    }

    this.errorMessage.set('');
    this.shipmentLoading.set(true);

    const request: ShipmentRequest = {
      ...this.buildQuoteRequest(),
      selectedRate: rate
    };

    this.shipmentService.createShipment(request).subscribe({
      next: (response) => {
        this.shipmentLoading.set(false);
        this.downloadPDF(response.masterTrackingNumber, response.pdf);
      },
      error: (error) => {
        this.shipmentLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to create shipment. Please try again.');
      }
    });
  }

  selectRate(rate: Rate): void {
    this.selectedRate.set(rate);
  }

  private buildQuoteRequest(): QuoteRequest {
    const formValue = this.form.value;
    const countryFrom = formValue.fromCountry;
    const provinceFrom = formValue.fromProvince;
    const countryTo = formValue.toCountry;
    const provinceTo = formValue.toProvince;

    // Combine date and time: "YYYY-MM-DD HH:mm"
    const scheduledShipDate = `${formValue.scheduledShipDate} ${formValue.scheduledShipTime}`;

    return {
      scheduledShipDate,
      shipFrom: {
        attention: formValue.fromAttention,
        company: formValue.fromCompany,
        address1: formValue.fromAddress1,
        cityName: formValue.fromCity,
        provinceDTO: {
          alpha2code: provinceFrom,
          countryCode: countryFrom,
          name: this.getProvinceCode(countryFrom, provinceFrom)
        },
        postalCode: formValue.fromPostal,
        countryDTO: {
          name: countryFrom
        },
        phone: this.normalizePhone(formValue.fromPhone),
        email: formValue.fromEmail || '',
        countryCode: countryFrom,
        countryName: this.getCountryName(countryFrom),
        provinceName: this.getProvinceName(provinceFrom),
        alphaNumericPostalCode: formValue.fromPostal
      },
      shipTo: {
        attention: formValue.toAttention,
        company: formValue.toCompany,
        address1: formValue.toAddress1,
        cityName: formValue.toCity,
        provinceDTO: {
          alpha2code: provinceTo,
          countryCode: countryTo,
          name: this.getProvinceCode(countryTo, provinceTo)
        },
        postalCode: formValue.toPostal,
        countryDTO: {
          name: countryTo
        },
        phone: this.normalizePhone(formValue.toPhone),
        email: formValue.toEmail || '',
        countryCode: countryTo,
        countryName: this.getCountryName(countryTo),
        provinceName: this.getProvinceName(provinceTo),
        alphaNumericPostalCode: formValue.toPostal
      },
      packageTypeDTO: {
        name: 'Package'
      },
      shipmentPackageUnits: {
        name: 'Imperial',
        system: 'IMPERIAL'
      },
      shipmentPackages: [
        {
          description: 'eCommerce',
          length: 7,
          width: 5,
          height: 2,
          weight: 1
        }
      ],
      shippingOrderAddSvc: this.getDefaultAddSvc(),
      shippingOrderCODService: {
        codServiceId: 0
      },
      codAddress: null,
      currencyCode: 'CAD'
    };
  }

  private getProvinceCode(countryCode: string, provinceCode: string): string {
    // Format: "CA-ON", "CA-BC", etc.
    return `${countryCode}-${provinceCode}`;
  }

  private getProvinceName(code: string): string {
    const map: Record<string, string> = {
      'ON': 'Ontario',
      'BC': 'British Columbia',
      'AB': 'Alberta',
      'QC': 'Quebec'
    };
    return map[code] || code;
  }

  private getCountryName(code: string): string {
    const map: Record<string, string> = {
      'CA': 'Canada',
      'US': 'United States',
      'MX': 'Mexico'
    };
    return map[code] || code;
  }

  private normalizePhone(phone: string): string {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  }

  private getTomorrowDate(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getDefaultAddSvc(): ShippingOrderAddSvc {
    return {
      ambientTemperatureRequired: false,
      coldChainRequired: false,
      crossBorderFee: false,
      customsFreight: false,
      dangerousGoods: 0,
      deliveryAppt: false,
      docsOnly: false,
      excessLength: false,
      exibitionSite: false,
      heated: false,
      hold: false,
      homelandSecurity: false,
      inBondFee: false,
      insideDelivery: false,
      insidePickup: false,
      keepCoolRequired: false,
      limitedAccess: false,
      militaryBaseDelivery: false,
      pierCharge: false,
      returnService: false,
      satDelivery: false,
      saturdayPickup: false,
      shipFromTailgate: false,
      shipToTailgate: false,
      signatureRequired: 0,
      singleShipment: false,
      fbaApproved: false,
      sortSegregate: false,
      noSafeDrop: false,
      insuranceType: 0,
      insuredAmount: 0.0,
      fbaapproved: false
    };
  }

  private downloadPDF(trackingNumber: string, pdfData: string | Blob | ArrayBuffer | undefined): void {
    if (!pdfData) {
      return;
    }

    try {
      let blob: Blob;
      if (typeof pdfData === 'string') {
        // Assume base64 encoded
        const binaryString = atob(pdfData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: 'application/pdf' });
      } else if (pdfData instanceof Blob) {
        blob = pdfData;
      } else {
        blob = new Blob([pdfData], { type: 'application/pdf' });
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${trackingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.errorMessage.set('Failed to download PDF. Please try again.');
    }
  }
}
