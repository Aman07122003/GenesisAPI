import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type CurrencyCode =
  | 'CAD'
  | 'USD'
  | 'EUR'
  | 'INR'
  | 'JPY';

export interface CurrencyRatesResponse {
  baseCurrency: string;

  rates: {
    CAD: number;
    USD: number;
    EUR: number;
    INR: number;
    JPY: number;
  };

  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl =
    `${environment.apiBaseUrl}/currency`;

  constructor(
    private http: HttpClient
  ) {}

  getRates(
    baseCurrency: string = 'CAD'
  ): Observable<CurrencyRatesResponse> {

    return this.http.get<CurrencyRatesResponse>(
      `${this.apiUrl}/rates`,
      {
        params: {
          base: baseCurrency
        }
      }
    );
  }
}