import { ChangeDetectionStrategy, Component, computed, ErrorHandler, inject, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';
import { Address } from '../../Models/address.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class ProfileComponent {
  public showOrdersListPageLink = input<boolean>(false);
  public showDivider = input<boolean>(true);
  public store = inject(BasketStore);

  constructor() {
    this.store.loadAddressesFromStorage();
  }

  readonly hasOldOrders = computed(() => {
    return this.store.OldOrdersList.length > 0;
  });

  readonly currentInvoiceAddress: Signal<Address> = computed(() => {
    const current = this.store.addresses()[0] || null;
    return current;
  });

  readonly currentShippingAddress: Signal<Address> = computed(() => {
    const current = this.store.addresses()[1] || null;
    return current;
  });

  readonly IsShippingAndInvoiceSame = computed(() => {
    const invoiceAddress = this.currentInvoiceAddress();
    const shippingAddress = this.currentShippingAddress();

    if (!invoiceAddress || !shippingAddress) {
      return false;
    }

    return (
      invoiceAddress.name === shippingAddress.name &&
      invoiceAddress.street === shippingAddress.street &&
      invoiceAddress.zipCode === shippingAddress.zipCode &&
      invoiceAddress.city === shippingAddress.city &&
      invoiceAddress.country === shippingAddress.country
    );
  });
}