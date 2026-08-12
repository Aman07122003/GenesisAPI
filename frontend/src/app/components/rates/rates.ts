import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rate } from '../../types';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rates.html',
  styleUrl: './rates.css'
})
export class Rates {
  @Input() rates: Rate[] = [];
  @Input() selectedRate: Rate | null = null;

  @Output() rateSelect = new EventEmitter<Rate>();
}
