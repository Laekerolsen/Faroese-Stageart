import { ChangeDetectionStrategy, Component, effect, ErrorHandler, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TermsModalComponent } from '../terms-modal/terms-modal';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';


@Component({
  selector: 'app-checkout-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TermsModalComponent, DynamicModalComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class CheckoutComponent implements OnInit {
  private store = inject(BasketStore);
  private router = inject(Router)
  basket = this.store.basket$;

  public isChecked: boolean = false;

  IsChecked = output<boolean>();

  constructor(){
    this.Checked = this.store.TermsAccepted();

    effect(() => {
      const b = this.store.basket();
      const s = this.store;
      if (!b) return;

      //this.Checked = s.TermsAccepted();
      
      
    });
  }

  ngOnInit(): void {
    this.Checked = this.store.TermsAccepted();
    this.IsChecked.emit(this.Checked);
  }

  public get Checked()
  {
    if (this.isChecked)
      this.hasCheckoutBeenClicked = false;
    
    return this.isChecked;
  }

  public set Checked(inpValue: boolean)
  {
    this.hasCheckoutBeenClicked = false;
    this.store.TermsAccepted.set(inpValue);
    this.store.TermsAccepted.update(v => inpValue);
    this.IsChecked.emit(inpValue);
    this.isChecked = inpValue;
  }

  public setChecked()
  {
    this.Checked = !this.Checked;

    this.store.TermsAccepted.set(!this.Checked)
    this.store.TermsAccepted.update(v => !this.Checked);

    this.store.saveTermsAccepted();
    
    this.IsChecked.emit(this.Checked);
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
      //alert('Din indkøbskurv er tom');
      this.openEmptyBasketModal();
      return;
    }

    if (!this.isChecked) {
      //alert('Venligst accepter salgs og leveringsbetingelser først.');
      this.openDynamicModal();
      return;
    }

    this.store.TermsAccepted.set(true);
    this.store.TermsAccepted.update(v => true);

    this.Checked = true;

    this.router.navigate(['/adresse']);
    //this.checkout();
  }

  public htmlContent: string = `<h2 class="text-2xl font-bold">Venligst accepter salgs og leveringsbetingelser først.</h2>
                                <p>Du skal acceptere salgs og leveringsbetingelserne, før du kan gennemføre et køb.</p>
                                <p>Udfyld checkboksen og accepter vores salgs og leveringsbetingelser.</p>`;

  public ShowDynamicModal = signal(false);

  openDynamicModal() {
    this.ShowDynamicModal.set(true);
  }

  public htmlContentEmptyBasket: string = `<h2 class="text-2xl font-bold">Din indkøbskurv er tom.</h2>
                                <p>Du skal tilføje mindst én vare, fysisk eller digital til kurven, før du kan gennemføre et køb.</p>
                                <p>Husk også at udfylde checkboksen og acceptere vores salgs og leveringsbetingelser.</p>`;

  public ShowEmptyBasketModal = signal(false);

  openEmptyBasketModal() {
    this.ShowEmptyBasketModal.set(true);
  }
}