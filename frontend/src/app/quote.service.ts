import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoteRequest, QuoteResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'https://genesis.eshipper.com/api/quotes';

  constructor(private http: HttpClient) {}

  getQuotes(request: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.apiUrl, request);
  }
}
