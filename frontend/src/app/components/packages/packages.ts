import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormArray, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './packages.html',
  styleUrl: './packages.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class Packages {
  @Input() packages!: FormArray;

  @Output() addPackage = new EventEmitter<void>();
  @Output() removePackage = new EventEmitter<number>();
}
