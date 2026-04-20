import { ChangeDetectionStrategy, Component, effect, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '../../../sanity/client';
import { BasketStore } from '../../../services/basket';
import { Address } from '../../../Models/address.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { OrderOverviewComponent } from '../../../components/orderoverview/orderoverview';

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

  public store: BasketStore;
  private router: Router;
  public isInit: boolean = false;

  form!: FormGroup<{
    useSameAddress: FormControl<boolean>;
    invoiceAddress: FormGroup<AddressForm>;
    deliveryAddress: FormGroup<AddressForm>;
  }>;

  get invoiceAddress() {
    return this.form.get('invoiceAddress') as FormGroup<AddressForm>;
  }

  get deliveryAddress() {
    return this.form.get('deliveryAddress') as FormGroup<AddressForm>;
  }

  constructor(private fb: FormBuilder, private _store: BasketStore, private _router: Router) {
    this.store = _store;
    this.router = _router;

    this.form = this.fb.group({
        useSameAddress: this.fb.control(true, { nonNullable: true }),
        invoiceAddress: this.createAddressGroup(),
        deliveryAddress: this.createAddressGroup()
      });

    if ((this.store.basket().useSameAddress && !this.store.basket().invoiceAddress && !this.store.basket().deliveryAddress) ||
        !this.store.basket().invoiceAddress)
    {
      this.handleAddressSync();
    }
    else
      this.handleAddressSync();

    this.isInit = true;
  }

  ngOnInit(): void {
    if (!this.store.basket().lines || this.store.basket().lines.length == 0)
      this.router.navigate(['/kurv']);
  }

  public ShowModal = signal(false);

  openModal() {
    this.ShowModal.set(true);
    this.show = true;
  }

  show: boolean = false;



  createAddressGroup(): FormGroup<AddressForm> {
    return this.fb.group({
      name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      company: this.fb.control<string | null>(null),
      street: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      street2: this.fb.control<string | null>(null),
      zipCode: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{4}$/)] }),
      city: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      country: this.fb.control('Danmark', { nonNullable: true, validators: [Validators.required] }),
      phone: this.fb.control<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[0-9+\s]*$/)] }),
      email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] })
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

    const invoiceFromBasket = this.store.basket().invoiceAddress;
    const deliveryFromBasket = this.store.basket().deliveryAddress;

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
        delivery.reset({
          name: '',
          company: null,
          street: '',
          street2: null,
          zipCode: '',
          city: '',
          country: 'Danmark',
          phone: '',
          email: ''
        });

        const value = this.form.getRawValue();

        this.store.basket().invoiceAddress = this.mapToAddress(value.invoiceAddress);
        this.store.basket().deliveryAddress = this.mapToAddress(value.deliveryAddress);
      }
    });

    invoice.valueChanges.subscribe(() => {
      if (same.value) {
        const value = this.form.getRawValue();
        delivery.patchValue(invoice.getRawValue());
        this.store.basket().invoiceAddress = this.mapToAddress(value.invoiceAddress);
        this.store.basket().deliveryAddress = this.mapToAddress(value.deliveryAddress);
      }
    });

    effect(() => {
      const b = this.store.basket();
      if (!b) return;

      invoice.patchValue(this.mapAddressToForm(b.invoiceAddress));
      delivery.patchValue(this.mapAddressToForm(b.deliveryAddress));
    });

    this.isInit = true;
  }

  private mapAddressToForm(address: Address) {
  return {
    name: address.name,
    company: address.company ?? null,
    street: address.street,
    street2: address.street2 ?? null,
    zipCode: address.zipCode,
    city: address.city,
    country: address.country,
    phone: address.phone ?? '',
    email: address.email ?? ''
  };
}

  destroySubs()
  {
    this.sameSubscription?.unsubscribe();
    this.invoiceSubscription?.unsubscribe();

    this.router.navigate(['/betaling']);
  }

  backToBasket()
  {
    this.router.navigate(['/kurv']);
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

  get shipping()
  {
    return this.store.basket().shippingInclVat;
  }

  public urlFor = urlFor;
}