import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Rate } from '../../types';

import {
  CurrencyService,
  CurrencyCode
} from '../../service/currency.service';


@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './rates.html',
  styleUrl: './rates.css'
})
export class Rates implements OnInit {

  // ============================================================
  // SHIPPING RATES
  // ============================================================

  private _rates: Rate[] = [];


  @Input()
  set rates(value: Rate[]) {

    this._rates = [...value].sort(
      (a, b) =>
        a.charge - b.charge
    );

  }


  get rates(): Rate[] {
    return this._rates;
  }


  @Input()
  selectedRate: Rate | null = null;


  @Output()
  rateSelect =
    new EventEmitter<Rate>();


  // ============================================================
  // CURRENCY
  // ============================================================

  selectedCurrency: CurrencyCode =
    'CAD';


  /*
   * No hardcoded exchange rates anymore.
   *
   * CAD = 1 because the original
   * shipping API returns CAD.
   */
  currencyRates:
    Partial<Record<CurrencyCode, number>> =
    {
      CAD: 1
    };


  currencyLoading = false;

  currencyError = '';


  constructor(
    private currencyService:
      CurrencyService
  ) {}


  // ============================================================
  // INITIALIZE
  // ============================================================

  ngOnInit(): void {

    this.loadCurrencyRates();

  }


  // ============================================================
  // LOAD REAL EXCHANGE RATES FROM BACKEND
  // ============================================================

  private loadCurrencyRates(): void {

    this.currencyLoading = true;

    this.currencyError = '';


    this.currencyService
      .getRates('CAD')
      .subscribe({

        next: (response) => {

          this.currencyRates = {
            ...response.rates,
            CAD: 1
          };

          this.currencyLoading = false;

          console.log(
            'CURRENCY RATES:',
            response
          );
        },


        error: (error) => {

          this.currencyLoading =
            false;


          this.currencyError =
            'Unable to load currency exchange rates.';


          console.error(
            'CURRENCY RATE ERROR:',
            error
          );

        }

      });

  }


  // ============================================================
  // CHANGE CURRENCY
  // ============================================================

  changeCurrency(
    currency: string
  ): void {

    const supportedCurrencies:
      CurrencyCode[] = [
        'CAD',
        'USD',
        'EUR',
        'INR',
        'JPY'
      ];


    if (
      supportedCurrencies.includes(
        currency as CurrencyCode
      )
    ) {

      this.selectedCurrency =
        currency as CurrencyCode;

    }

  }


  // ============================================================
  // CONVERT CAD -> SELECTED CURRENCY
  // ============================================================

  convertCurrency(
    cadAmount: number
  ): number {

    /*
     * CAD doesn't require conversion.
     */
    if (
      this.selectedCurrency === 'CAD'
    ) {

      return cadAmount;

    }


    const exchangeRate =
      this.currencyRates[
        this.selectedCurrency
      ];


    /*
     * If rates haven't loaded yet,
     * don't produce NaN.
     */
    if (
      exchangeRate === undefined
    ) {

      return cadAmount;

    }


    return (
      cadAmount *
      exchangeRate
    );

  }


  // ============================================================
  // FORMAT DISPLAYED PRICE
  // ============================================================

  formatCurrency(
    cadAmount: number
  ): string {

    const exchangeRate =
      this.currencyRates[
        this.selectedCurrency
      ];


    /*
     * CAD always works because
     * original API price is CAD.
     */
    if (
      this.selectedCurrency === 'CAD'
    ) {

      return new Intl.NumberFormat(
        'en-CA',
        {
          style: 'currency',
          currency: 'CAD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ).format(
        cadAmount
      );

    }


    /*
     * Currency data hasn't loaded yet.
     */
    if (
      exchangeRate === undefined
    ) {

      return 'Loading...';

    }


    const convertedAmount =
      this.convertCurrency(
        cadAmount
      );


    /*
     * JPY normally doesn't use
     * decimal places.
     */
    const decimalPlaces =
      this.selectedCurrency === 'JPY'
        ? 0
        : 2;


    return new Intl.NumberFormat(
      this.getCurrencyLocale(),
      {

        style: 'currency',

        currency:
          this.selectedCurrency,

        minimumFractionDigits:
          decimalPlaces,

        maximumFractionDigits:
          decimalPlaces

      }
    ).format(
      convertedAmount
    );

  }


  // ============================================================
  // CURRENCY LOCALE
  // ============================================================

  private getCurrencyLocale():
    string {

    switch (
      this.selectedCurrency
    ) {

      case 'CAD':
        return 'en-CA';


      case 'USD':
        return 'en-US';


      case 'EUR':
        return 'en-IE';


      case 'INR':
        return 'en-IN';


      case 'JPY':
        return 'ja-JP';


      default:
        return 'en-CA';

    }

  }

}