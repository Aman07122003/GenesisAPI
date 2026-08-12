import { Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class Schedule {}
