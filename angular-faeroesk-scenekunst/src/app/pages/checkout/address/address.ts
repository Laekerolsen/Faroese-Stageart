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
        useSameAddress: this.fb.control(this.store.basket().useSameAddress, { nonNullable: true }),
        invoiceAddress: this.createAddressGroup(true),
        deliveryAddress: this.createAddressGroup(false)
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
    if (!this.store.basket().lines || this.store.basket().lines.length == 0 || !this.store.TermsAccepted())
      this.router.navigate(['/kurv']);

    this.store.TermsAccepted.set(true);
  }

  public ShowModal = signal(false);

  openModal() {
    this.ShowModal.set(true);
    this.show = true;
  }

  show: boolean = false;



  createAddressGroup(isInvoice: boolean): FormGroup<AddressForm> {
    const inName = isInvoice ? this.store.basket().invoiceAddress.name || '' : this.store.basket().deliveryAddress.name || '';
    const inComp = (isInvoice ? this.store.basket().invoiceAddress.company || '' : this.store.basket().deliveryAddress.company || '') || null;
    const inStreet = isInvoice ? this.store.basket().invoiceAddress.street || '' : this.store.basket().deliveryAddress.street || '';
    const inStreet2 = (isInvoice ? this.store.basket().invoiceAddress.street2 || '' : this.store.basket().deliveryAddress.street2 || '') || null;
    const inZipCode = isInvoice ? this.store.basket().invoiceAddress.zipCode || '' : this.store.basket().deliveryAddress.zipCode || '';
    const inCity = isInvoice ? this.store.basket().invoiceAddress.city || '' : this.store.basket().deliveryAddress.city || '';
    const inCountry = (isInvoice ? this.store.basket().invoiceAddress.country || 'Danmark' : this.store.basket().deliveryAddress.country || 'Danmark') || 'Danmark'; 
    const inPhone = (isInvoice ? this.store.basket().invoiceAddress.phone || '' : this.store.basket().deliveryAddress.phone || '') || null;
    const inEmail = (isInvoice ? this.store.basket().invoiceAddress.email || '' : this.store.basket().deliveryAddress.email || '') || '';

    return this.fb.group({
      name: this.fb.control(inName, { nonNullable: true, validators: [Validators.required] }),
      company: this.fb.control<string | null>(inComp),
      street: this.fb.control(inStreet, { nonNullable: true, validators: [Validators.required] }),
      street2: this.fb.control<string | null>(inStreet2),
      zipCode: this.fb.control(inZipCode, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{4}$/)] }),
      city: this.fb.control(inCity, { nonNullable: true, validators: [Validators.required] }),
      country: this.fb.control(inCountry, { nonNullable: true, validators: [Validators.required] }),
      phone: this.fb.control<string | null>(inPhone, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[0-9+\s]*$/)] }),
      email: this.fb.control(inEmail, { nonNullable: true, validators: [Validators.required, Validators.email] })
    });
  }

  private mapToAddress(address: any): Address {
    const addresFromInput: Address = {
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
  return addresFromInput;
}

  sameSubscription: Subscription | null = null;
  invoiceSubscription: Subscription | null = null;

  handleAddressSync() {
    const invoice = this.form.get('invoiceAddress')!;
    const delivery = this.form.get('deliveryAddress')!;
    const same = this.form.get('useSameAddress')!;

    const invoiceFromBasket = this.store.basket().invoiceAddress;
    const deliveryFromBasket = this.store.basket().deliveryAddress;

    if (this.store.basket().shippingExclVat === 0)
      same.disable();
    else
      same.enable();

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

    this.store.TermsAccepted.set(true);
    this.store.AddressConfirmed.set(true);

    this.store.saveTermsAccepted();
    this.store.saveAddressConfirmed();

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

      this.store.TermsAccepted.set(true);

      this.destroySubs();
    }
  }

  get shipping()
  {
    return this.store.basket().shippingInclVat;
  }

  clearForm(event: MouseEvent)
  {
    this.spawnRipple(event);

    const invoice = this.form.get('invoiceAddress')!;
    const delivery = this.form.get('deliveryAddress')!;
    const same = this.form.get('useSameAddress')!;

    invoice.reset({
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
    this.store.basket().invoiceAddress = {
          name: '',
          company: '',
          street: '',
          street2: '',
          zipCode: '',
          city: '',
          country: 'Danmark',
          phone: '',
          email: ''
        };
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
    this.store.basket().deliveryAddress = {
          name: '',
          company: '',
          street: '',
          street2: '',
          zipCode: '',
          city: '',
          country: 'Danmark',
          phone: '',
          email: ''
        };
    same.reset(true);
    this.store.basket().useSameAddress = true;
  }

  spawnRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);

    button.classList.remove('ripple'); // reset animation
    void button.offsetWidth; // force reflow
    button.classList.add('ripple');

    setTimeout(() => button.classList.remove('ripple'), 600);
  }

  public urlFor = urlFor;
}