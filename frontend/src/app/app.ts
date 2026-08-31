import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { QuoteService } from './service/quote.service';
import { ShipmentService } from './service/shipment.service';
import { Rate, QuoteRequest, ShipmentRequest} from './types';
import { Schedule } from './components/schedule/schedule';
import { Route } from './components/route/route';
import { Packages } from './components/packages/packages';
import { Rates } from './components/rates/rates';
import { Actions } from './components/actions/actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Schedule, Route, Packages, Rates, Actions],
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
    description: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    length: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999)
      ]
    ],

    width: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999)
      ]
    ],

    height: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999)
      ]
    ],

    weight: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(9999)
      ]
    ]
  });
}

private noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (typeof value !== 'string') {
    return null;
  }

  return value.trim().length === 0
    ? { whitespace: true }
    : null;
}

private canadianPostalCodeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const postalCode = value
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s/g, '');

  const canadianPostalRegex =
    /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/;

  return canadianPostalRegex.test(postalCode)
    ? null
    : { invalidPostalCode: true };
}

private phoneValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const digits = value
    .toString()
    .replace(/\D/g, '');

  return digits.length === 10
    ? null
    : { invalidPhone: true };
}

private futureOrTodayDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(`${control.value}T00:00:00`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today
    ? null
    : { pastDate: true };
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
  return this.fb.group({

    scheduledShipDate: [
      this.getTodayDate(),
      [
        Validators.required,
        this.futureOrTodayDateValidator.bind(this)
      ]
    ],

    scheduledShipTime: [
      '11:00',
      [
        Validators.required,
        Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
      ]
    ],

    // =========================
    // FROM
    // =========================

    fromAttention: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    fromCompany: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    fromAddress1: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(200)
      ]
    ],

    fromAddress2: [
      '',
      [
        Validators.maxLength(200)
      ]
    ],

    fromCity: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    fromProvince: [
      '',
      [
        Validators.required
      ]
    ],

    fromPostal: [
      '',
      [
        Validators.required,
        this.canadianPostalCodeValidator.bind(this)
      ]
    ],

    fromCountry: [
      'CA',
      [
        Validators.required
      ]
    ],

    fromPhone: [
      '',
      [
        Validators.required,
        this.phoneValidator.bind(this)
      ]
    ],

    fromEmail: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    // =========================
    // TO
    // =========================

    toAttention: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    toCompany: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    toAddress1: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(200)
      ]
    ],

    toAddress2: [
      '',
      [
        Validators.maxLength(200)
      ]
    ],

    toCity: [
      '',
      [
        Validators.required,
        this.noWhitespaceValidator.bind(this),
        Validators.maxLength(100)
      ]
    ],

    toProvince: [
      '',
      [
        Validators.required
      ]
    ],

    toPostal: [
      '',
      [
        Validators.required,
        this.canadianPostalCodeValidator.bind(this)
      ]
    ],

    toCountry: [
      'CA',
      [
        Validators.required
      ]
    ],

    toPhone: [
      '',
      [
        Validators.required,
        this.phoneValidator.bind(this)
      ]
    ],

    toEmail: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    // =========================
    // PACKAGES
    // =========================

    packages: this.fb.array([
      this.createPackage()
    ])
  });
}

  onQuote(): void {
  if (this.quoteLoading()) {
    return;
  }

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.errorMessage.set(
      'Please correct the highlighted fields before requesting a quote.'
    );
    return;
  }

  this.errorMessage.set('');
  this.quoteLoading.set(true);
  this.selectedRate.set(null);
  this.rates.set([]);

  const request = this.buildQuoteRequest();

  console.log(
    'QUOTE REQUEST:',
    JSON.stringify(request, null, 2)
  );

  this.quoteService.getQuotes(request).subscribe({
    next: (response) => {
      this.quoteLoading.set(false);

      if (response.rates && response.rates.length > 0) {
        this.rates.set(response.rates);
      } else {
        this.errorMessage.set(
          'No shipping rates available for the selected shipment.'
        );
      }
    },

    error: (error) => {
      this.quoteLoading.set(false);

      this.errorMessage.set(
        error?.error?.message ||
        'Failed to retrieve quotes. Please try again.'
      );
    }
  });
}

  
onShipment(): void {
  if (this.shipmentLoading()) {
    return;
  }

  if (!this.selectedRate()) {
    this.errorMessage.set(
      'Please select a shipping rate before creating the shipment.'
    );
    return;
  }

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.errorMessage.set(
      'Please correct the highlighted fields before creating the shipment.'
    );
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
      postalCode: this.normalizePostalCode(formValue.fromPostal),
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
      alphaNumericPostalCode: this.normalizePostalCode(formValue.fromPostal),
      countryCode: countryFrom
    },

    shipTo: {
      attention: formValue.toAttention,
      company: formValue.toCompany,
      address1: formValue.toAddress1,
      postalCode: this.normalizePostalCode(formValue.toPostal),
      phone: this.normalizePhone(formValue.toPhone),
      email: formValue.toEmail,

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

    shipmentPackages: formValue.packages.map((pkg: any) => ({
      description: pkg.description,
      height: Number(pkg.height),
      length: Number(pkg.length),
      weight: Number(pkg.weight),
      width: Number(pkg.width)
    })),

    shippingOrderCODService: {
      codServiceId: 0
    },

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

  private normalizePostalCode(postalCode: string): string {
    return postalCode
      .trim()
      .toUpperCase()
      .replace(/\s/g, '');
  }

  private getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
