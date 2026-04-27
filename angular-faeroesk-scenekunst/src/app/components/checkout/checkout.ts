import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TermsModalComponent } from '../terms-modal/terms-modal';


@Component({
  selector: 'app-checkout-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TermsModalComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CheckoutComponent  {
  private store = inject(BasketStore);
  private router = inject(Router)
  basket = this.store.basket$;

  public isChecked: boolean = false;

  public get Checked()
  {
    if (this.isChecked)
      this.hasCheckoutBeenClicked = false;
    
    return this.isChecked;
  }

  public set Checked(inpValue: boolean)
  {
    this.hasCheckoutBeenClicked = !inpValue;
    this.isChecked = inpValue;
  }

  async checkout() {
    const basket = this.store.basket$();

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(basket)
    });

    const { url } = await res.json();
    window.location.href = url;
  }
  public ShowModal = signal(false);

  openModal() {
    this.ShowModal.set(true);
  }

  public hasCheckoutBeenClicked: boolean = false;

  handleCheckout() {
    this.hasCheckoutBeenClicked = true;

    if (!this.basket().lines.length) {
      alert('Din indkøbskurv er tom');
      return;
    }

    if (!this.isChecked) {
      alert('Venligst accepter salgs og leveringsbetingelser først.');
      return;
    }

    this.router.navigate(['/adresse']);
    //this.checkout();
  }
}