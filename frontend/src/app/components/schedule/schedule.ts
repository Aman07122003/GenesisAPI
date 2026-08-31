import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class Schedule implements OnInit {

  minDate = '';
  minTime = '';

  ngOnInit(): void {
    this.updateDateTimeLimits();
  }

  updateDateTimeLimits(): void {
    const now = new Date();

    this.minDate = this.formatDate(now);

    this.minTime = this.formatTime(now);
  }

  onDateChange(): void {
    const form = this.getForm();

    const selectedDate = form.get('scheduledShipDate')?.value;

    if (!selectedDate) {
      this.minTime = '';
      return;
    }

    const today = this.formatDate(new Date());

    if (selectedDate === today) {
      this.minTime = this.formatTime(new Date());
    } else {
      // Future date → any time is allowed
      this.minTime = '00:00';
    }

    // If user selected today's date and already-selected
    // time is in the past, clear it.
    const selectedTime = form.get('scheduledShipTime')?.value;

    if (
      selectedDate === today &&
      selectedTime &&
      selectedTime < this.minTime
    ) {
      form.get('scheduledShipTime')?.setValue('');
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  private getForm() {
    return this.formDirective.form;
  }

  constructor(
    private formDirective: FormGroupDirective
  ) {}
}