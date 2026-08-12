import { Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './route.html',
  styleUrl: './route.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class Route {}
