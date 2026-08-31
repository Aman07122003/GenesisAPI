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
  private _rates: Rate[] = [];

  @Input()
  set rates(value: Rate[]) {
    this._rates = [...value].sort(
      (a, b) => a.charge - b.charge
    );
  }

  get rates(): Rate[] {
    return this._rates;
  }

  @Input() selectedRate: Rate | null = null;

  @Output() rateSelect = new EventEmitter<Rate>();
}