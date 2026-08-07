import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from './quote.service';
import { ShipmentService } from './shipment.service';
import { Rate, QuoteRequest, ShipmentRequest } from './types';

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
    return this.fb.group({
      scheduledShipDate: ['2026-08-06', Validators.required],
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
    return {
      scheduledShipDate: formValue.scheduledShipDate,
      scheduledShipTime: formValue.scheduledShipTime,
      shipFrom: {
        attention: formValue.fromAttention,
        company: formValue.fromCompany,
        address1: formValue.fromAddress1,
        address2: formValue.fromAddress2 || undefined,
        cityName: formValue.fromCity,
        provinceDTO: {
          name: this.getProvinceName(formValue.fromProvince),
          alpha2code: formValue.fromProvince
        },
        postalCode: formValue.fromPostal,
        countryDTO: {
          name: this.getCountryName(formValue.fromCountry)
        },
        phone: formValue.fromPhone,
        email: formValue.fromEmail,
        countryCode: formValue.fromCountry
      },
      shipTo: {
        attention: formValue.toAttention,
        company: formValue.toCompany,
        address1: formValue.toAddress1,
        address2: formValue.toAddress2 || undefined,
        cityName: formValue.toCity,
        provinceDTO: {
          name: this.getProvinceName(formValue.toProvince),
          alpha2code: formValue.toProvince
        },
        postalCode: formValue.toPostal,
        countryDTO: {
          name: this.getCountryName(formValue.toCountry)
        },
        phone: formValue.toPhone,
        countryCode: formValue.toCountry
      },
      // Send default values for fields not exposed in UI
      packageTypeDTO: 'Package',
      shipmentPackageUnits: 'Imperial',
      shipmentPackages: [
        {
          description: 'eCommerce',
          length: 7,
          width: 5,
          height: 2,
          weight: 1,
          quantity: 1
        }
      ],
      shippingOrderAddSvc: {},
      currencyCode: 'CAD'
    };
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
