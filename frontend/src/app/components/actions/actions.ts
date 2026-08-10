import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions.html',
  styleUrl: './actions.css'
})
export class Actions {
  @Input() quoteLoading = false;
  @Input() quoteDisabled = false;
  @Input() shipmentLoading = false;
  @Input() shipmentDisabled = false;

  @Output() quote = new EventEmitter<void>();
  @Output() shipment = new EventEmitter<void>();
}
