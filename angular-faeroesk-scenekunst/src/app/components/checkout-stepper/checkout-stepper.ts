import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';

export type CheckoutStep = 'kurv' | 'adresse' | 'betaling';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-stepper.html',
  styleUrl: './checkout-stepper.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CheckoutStepperComponent {
  public store = inject(BasketStore);
  private router = inject(Router)
  basket = this.store.basket$;

  currentStep = input.required<CheckoutStep>();

  steps: CheckoutStep[] = ['kurv', 'adresse', 'betaling'];

  stepIndex = (step: CheckoutStep) => this.steps.indexOf(step);

  currentIndex = computed(() =>
    this.stepIndex(this.currentStep())
  );

  isCompleted = (step: CheckoutStep) =>
    this.stepIndex(step) < this.currentIndex();

  isActive = (step: CheckoutStep) =>
    this.stepIndex(step) === this.currentIndex();

  go2Step(step: CheckoutStep)
  {
    if (this.currentStep() == "kurv")
      return;

    if (this.currentStep() == "adresse" && step == "betaling")
      return;
    
    this.router.navigate(['/' + step.toString().toLowerCase()])
  }
}