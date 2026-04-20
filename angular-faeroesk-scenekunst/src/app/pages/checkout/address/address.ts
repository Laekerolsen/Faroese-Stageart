import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '../../../sanity/client';
import { BasketStore } from '../../../services/basket';
import { Address } from '../../../Models/address.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

const builder = createImageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

type AddressForm = {
    name: FormControl<string>;
    company: FormControl<string | null>;
    street: FormControl<string>;
    street2: FormControl<string | null>;
    zipCode: FormControl<string>;
    city: FormControl<string>;
    country: FormControl<string>;
    phone: FormControl<string | null>;
    email: FormControl<string>;
  };


@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.html',
  styleUrl: './address.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AddressPageComponent implements OnInit {

  private store: BasketStore;
  private router: Router;

  form!: FormGroup<{
    useSameAddress: FormControl<boolean>;
    invoiceAddress: FormGroup<AddressForm>;
    deliveryAddress: FormGroup<AddressForm>;
  }>;

  constructor(private fb: FormBuilder, private _store: BasketStore, private _router: Router) {
    this.store = _store;
    this.router = _router;
  }

  ngOnInit(): void {
    if ((this.store.basket().useSameAddress && !this.store.basket().invoiceAddress && !this.store.basket().deliveryAddress) ||
        !this.store.basket().invoiceAddress)
    {

      this.form = this.fb.group({
        useSameAddress: this.fb.control(true, { nonNullable: true }),
        invoiceAddress: this.createAddressGroup(),
        deliveryAddress: this.createAddressGroup()
      });

      this.handleAddressSync();
    }
  }

  createAddressGroup(): FormGroup<AddressForm> {
    return this.fb.group({
      name: this.fb.control('', { nonNullable: true }),
      company: this.fb.control<string | null>(null),
      street: this.fb.control('', { nonNullable: true }),
      street2: this.fb.control<string | null>(null),
      zipCode: this.fb.control('', { nonNullable: true }),
      city: this.fb.control('', { nonNullable: true }),
      country: this.fb.control('Danmark', { nonNullable: true }),
      phone: this.fb.control<string | null>(null),
      email: this.fb.control('', { nonNullable: true })
    });
  }

  private mapToAddress(address: any): Address {
  return {
    name: address.name,
    company: address.company,
    street: address.street,
    street2: address.street2,
    zipCode: address.zipCode,
    city: address.city,
    country: address.country,
    phone: address.phone,
    email: address.email
  };
}

  sameSubscription: Subscription | null = null;
  invoiceSubscription: Subscription | null = null;

  handleAddressSync() {
    const invoice = this.form.get('invoiceAddress')!;
    const delivery = this.form.get('deliveryAddress')!;
    const same = this.form.get('useSameAddress')!;

    this.sameSubscription = same.valueChanges.subscribe(isSame => {
      this.store.basket().useSameAddress = isSame;

      if (isSame) {
        delivery.disable();
        delivery.patchValue(invoice.getRawValue());

        const value = this.form.getRawValue();

        this.store.basket().invoiceAddress = this.mapToAddress(value.invoiceAddress);
        this.store.basket().deliveryAddress = this.mapToAddress(value.invoiceAddress);
      } else {
        delivery.enable();

        const value = this.form.getRawValue();

        this.store.basket().invoiceAddress = this.mapToAddress(value.invoiceAddress);
        this.store.basket().deliveryAddress = this.mapToAddress(value.deliveryAddress);
      }
    });

    invoice.valueChanges.subscribe(() => {
      if (same.value) {
        delivery.patchValue(invoice.getRawValue());
      }
    });
  }

  destroySubs()
  {
    this.sameSubscription?.unsubscribe();
    this.invoiceSubscription?.unsubscribe();

    this.router.navigate(['/betaling']);
  }

  submit() {
    if (this.form.invalid) return;

    if (this.form.valid) {
      const value = this.form.getRawValue();

      this.store.basket().useSameAddress = value.useSameAddress;

      this.store.basket().invoiceAddress = this.mapToAddress(value.invoiceAddress);
      this.store.basket().deliveryAddress = this.mapToAddress(value.deliveryAddress);

      this.destroySubs();
    }
  }

  public urlFor = urlFor;
}