import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoteRequest, QuoteResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = '/quotes';

  constructor(private http: HttpClient) {}

  getQuotes(request: QuoteRequest): Observable<QuoteResponse> {
    console.log('QUOTE REQUEST:', request);

    return this.http.post<QuoteResponse>(
      this.apiUrl,
      request
    );
  }
}