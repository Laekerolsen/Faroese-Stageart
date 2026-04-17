import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { BasketStore } from '../../services/basket';

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
  imports: [CommonModule],
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
  
  public hasLoaded: boolean = false;
  private zone: NgZone;

  constructor(private ngZone: NgZone) {
    this.zone = ngZone;

    console.log('BasketComponent constructor called');
  }

  ngOnInit() {
    //this.posts = await client.fetch(POSTS_QUERY);
    console.log('BasketComponent ngOnInit called');
    this.zone.run(() => {

      this.hasLoaded = true;
      });
  }

  public urlFor = urlFor;
}