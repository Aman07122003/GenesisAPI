import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShipmentRequest, ShipmentResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = environment.production ? `${environment.apiBaseUrl}/shipments` : '/shipments';

  constructor(private http: HttpClient) {}

  createShipment(request: ShipmentRequest): Observable<ShipmentResponse> {
    return this.http.post<ShipmentResponse>(this.apiUrl, request);
  }
}
