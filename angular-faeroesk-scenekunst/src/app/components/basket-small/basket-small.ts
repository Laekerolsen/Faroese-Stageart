import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-basket-small-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket-small.html',
  styleUrl: './basket-small.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BasketSmallComponent implements OnInit {
  private store = inject(BasketStore);
  basket = this.store.basket$;

  remove(id: string) {
    this.store.remove(id);
  }
  
  public hasLoaded: boolean = false;
  private zone: NgZone;

  private router: Router;

  constructor(private ngZone: NgZone, private _router: Router) {
    this.zone = ngZone;
    this.router = _router;

    console.log('BasketComponent constructor called');
  }

  ngOnInit() {
    //this.posts = await client.fetch(POSTS_QUERY);
    console.log('BasketComponent ngOnInit called');
    this.zone.run(() => {

      this.hasLoaded = true;
      });
  }

  checkout(){
    this.router.navigate(['/kurv']);
  }

  public urlFor = urlFor;
}