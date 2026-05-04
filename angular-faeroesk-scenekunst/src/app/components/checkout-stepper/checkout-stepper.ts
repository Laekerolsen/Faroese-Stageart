import { ChangeDetectionStrategy, Component, computed, ErrorHandler, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';

export type CheckoutStep = 'kurv' | 'adresse' | 'betaling';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-stepper.html',
  styleUrl: './checkout-stepper.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class CheckoutStepperComponent {
  public store = inject(BasketStore);
  private router = inject(Router);
  private activerouteSnapshot = inject(ActivatedRoute);
  basket = this.store.basket$;

  currentStep = input.required<CheckoutStep>();

  steps: CheckoutStep[] = ['kurv', 'adresse', 'betaling'];

  lastStep = this.steps[this.steps.length - 1];

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

  get IsLastStepCompleted() {
    const lastStepIndex = this.stepIndex(this.lastStep);
    const currentStepIndex = this.currentIndex();

    return currentStepIndex >= lastStepIndex;
  }

  get IsConfirmationRoute() {

    let currentRoute = this.activerouteSnapshot;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const path = currentRoute.snapshot.routeConfig?.path;
    const isConfirmation = path === '/betalt' || path === 'betalt';

    //console.log('Current path:', path, 'Is confirmation route:', isConfirmation);

    return isConfirmation;
  }
}