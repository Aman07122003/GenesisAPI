import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuoteService } from './service/quote.service';
import { ShipmentService } from './service/shipment.service';
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

  private createPackage(): FormGroup {
  return this.fb.group({
    description: ['eCommerce', Validators.required],
    length: [7, [Validators.required, Validators.min(0.01)]],
    width: [5, [Validators.required, Validators.min(0.01)]],
    height: [2, [Validators.required, Validators.min(0.01)]],
    weight: [1, [Validators.required, Validators.min(0.01)]]
  });
}

  get packages(): FormArray {
  return this.form.get('packages') as FormArray;
}

addPackage(): void {
  this.packages.push(this.createPackage());
}

removePackage(index: number): void {
  if (this.packages.length <= 1) {
    return;
  }

  this.packages.removeAt(index);
}

  private createForm(): FormGroup {
  const tomorrow = this.getTomorrowDate();

  return this.fb.group({

    scheduledShipDate: [
      tomorrow,
      Validators.required
    ],

    scheduledShipTime: [
      '11:00',
      Validators.required
    ],

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

    // Packages
    packages: this.fb.array([
      this.createPackage()
    ])

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
  if (!this.selectedRate() || this.form.invalid || this.shipmentLoading()) {
    return;
  }

  this.errorMessage.set('');
  this.shipmentLoading.set(true);

  const request: ShipmentRequest = {
    shippingOrderRateDTO: this.buildQuoteRequest()
  };

  console.log(
    'SHIPMENT REQUEST:',
    JSON.stringify(request, null, 2)
  );

  this.shipmentService.createShipment(request).subscribe({
    next: (response) => {
      this.shipmentLoading.set(false);

      console.log('===== SHIPMENT API RESPONSE =====');
      console.log(response);
      console.log('Response type:', typeof response);

      console.log('Labels:', response?.labels);
      console.log(
        'PDF content:',
        response?.labels?.[0]?.content
      );
      console.log(
        'PDF content type:',
        typeof response?.labels?.[0]?.content
      );
      console.log(
        'Tracking:',
        response?.masterTrackingNumber
      );

      this.downloadPDF(
        response.masterTrackingNumber,
        response?.labels?.[0]?.content
      );
    },

    error: (error) => {
      this.shipmentLoading.set(false);

      console.error('SHIPMENT ERROR:', error);
      console.error('SHIPMENT ERROR BODY:', error?.error);

      this.errorMessage.set(
        error?.error?.message ||
        'Failed to create shipment. Please try again.'
      );
    }
  });
}


  selectRate(rate: Rate): void {
    this.selectedRate.set(rate);
  }

  private buildQuoteRequest(): QuoteRequest {
  const formValue = this.form.getRawValue();

  const countryFrom = formValue.fromCountry;
  const provinceFrom = formValue.fromProvince;

  const countryTo = formValue.toCountry;
  const provinceTo = formValue.toProvince;

  const scheduledShipDate =
    `${formValue.scheduledShipDate} ${formValue.scheduledShipTime}`;

  return {
    shipFrom: {
      attention: formValue.fromAttention,
      company: formValue.fromCompany,
      address1: formValue.fromAddress1,
      postalCode: formValue.fromPostal,
      phone: this.normalizePhone(formValue.fromPhone),
      email: formValue.fromEmail,

      countryDTO: {
        name: countryFrom
      },

      provinceDTO: {
        alpha2code: provinceFrom,
        countryCode: countryFrom,
        name: `${countryFrom}-${provinceFrom}`
      },

      countryName: this.getCountryName(countryFrom),
      provinceName: this.getProvinceName(provinceFrom),
      cityName: formValue.fromCity,
      alphaNumericPostalCode: formValue.fromPostal,
      countryCode: countryFrom
    },

    shipTo: {
      attention: formValue.toAttention,
      company: formValue.toCompany,
      address1: formValue.toAddress1,
      postalCode: formValue.toPostal,
      phone: this.normalizePhone(formValue.toPhone),

      // Match your required payload exactly
      email: 'info@eshipper.com',

      countryDTO: {
        name: countryTo
      },

      provinceDTO: {
        alpha2code: provinceTo,
        countryCode: countryTo,
        name: `${countryTo}-${provinceTo}`
      },

      countryName: this.getCountryName(countryTo),
      provinceName: this.getProvinceName(provinceTo),
      cityName: formValue.toCity,
      alphaNumericPostalCode: formValue.toPostal,
      countryCode: countryTo
    },

    scheduledShipDate,

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
        height: 2,
        length: 7,
        weight: 1,
        width: 5
      }
    ],

    shippingOrderAddSvc: {
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
    },

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

  private downloadPDF(
  trackingNumber: string,
  pdfData: string | Blob | ArrayBuffer | undefined
): void {

  console.log('===== PDF DOWNLOAD =====');
  console.log('Tracking number:', trackingNumber);
  console.log('PDF data exists:', !!pdfData);
  console.log('PDF data type:', typeof pdfData);

  if (!pdfData) {
    console.error('No PDF data returned by shipment API');
    this.errorMessage.set('Shipment created, but no PDF was returned.');
    return;
  }

  try {
    let blob: Blob;

    if (pdfData instanceof Blob) {

      console.log('PDF is already a Blob');

      blob = pdfData;

    } else if (pdfData instanceof ArrayBuffer) {

      console.log('PDF is an ArrayBuffer');

      blob = new Blob(
        [pdfData],
        { type: 'application/pdf' }
      );

    } else if (typeof pdfData === 'string') {

      console.log('PDF is a Base64 string');
      console.log('PDF string length:', pdfData.length);

      // Remove data URI prefix if present
      const base64 = pdfData.includes(',')
        ? pdfData.split(',')[1]
        : pdfData;

      // Remove whitespace/newlines
      const cleanBase64 = base64.replace(/\s/g, '');

      const binaryString = atob(cleanBase64);

      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      blob = new Blob(
        [bytes],
        { type: 'application/pdf' }
      );

    } else {

      console.error('Unsupported PDF response type');
      this.errorMessage.set('Unsupported PDF response format.');
      return;
    }

    console.log('Blob created');
    console.log('Blob size:', blob.size);
    console.log('Blob type:', blob.type);

    if (blob.size === 0) {
      console.error('PDF blob is empty');
      this.errorMessage.set('The returned PDF is empty.');
      return;
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `${trackingNumber || 'shipment'}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    console.log('PDF download triggered');

  } catch (error) {

    console.error('PDF DOWNLOAD ERROR:', error);

    this.errorMessage.set(
      'Shipment was created, but the PDF could not be downloaded.'
    );
  }
}
}
