import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';
import { FormsModule } from '@angular/forms';
import { BasketLine } from '../../Models/basketline.model';

const builder = createImageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

interface Post {
  title: string;
  price: string;
  slug: { current: string };
  body?: any[];
  image?: any;
  publishedAt?: string;
  // add other fields your Sanity post has
}

@Component({
  selector: 'app-basket-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.html',
  styleUrl: './basket.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BasketComponent implements OnInit {
  private store = inject(BasketStore);
  basket = this.store.basket$;

  remove(id: string) {
    this.store.remove(id);
  }

  clear()
  {
    this.store.clear();
  }

  onQuantityChange(line: BasketLine, value: number) {
    let corrected = value;

    if (isNaN(corrected)) {
      corrected = 1;
    }

    if (corrected < 0) {
      corrected = Math.abs(corrected);
    }

    if (corrected === 0) {
      corrected = 1;
    }

    line.quantity = corrected;

    this.store.update(line.productId);
  }

  onQuantityBlur(line: BasketLine) {
  if (!line.quantity || line.quantity < 1) {
    line.quantity = 1;
  }

  this.store.update(line.productId);
}
  
  public hasLoaded: boolean = false;
  private zone: NgZone;

  constructor(private ngZone: NgZone) {
    this.zone = ngZone;
  }

  ngOnInit() {
    this.zone.run(() => {

      this.hasLoaded = true;
      });
  }

  public urlFor = urlFor;
}