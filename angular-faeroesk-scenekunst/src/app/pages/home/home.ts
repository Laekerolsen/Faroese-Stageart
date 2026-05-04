import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SeoMetadata } from '../../services/seo-metadata';
import { BasketStore } from '../../services/basket';

const POSTS_QUERY = `*[_type == "post"&& defined(slug.current)]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, image}`;
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
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HomeComponent implements OnInit {
  posts$ = from(client.fetch(POSTS_QUERY));

  protected readonly title = signal('Færøsk Scenekunst');
  protected readonly description = signal('Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.');
  protected readonly keywords = signal('Færøsk Scenekunst, teater, dans, performancekunst, Færøyene');
  seoMetadata: SeoMetadata;

  public posts: any[] = [];
  public hasLoaded: boolean = false;
  private zone: NgZone;

  private store: BasketStore;

  constructor(private ngZone: NgZone, private _seoMetadata: SeoMetadata, private _store: BasketStore) {
    this.zone = ngZone;
    this.store = _store;
    // Set SEO metadata
    this.seoMetadata = _seoMetadata;
    this.seoMetadata.title.set(this.title());
    this.seoMetadata.description.set(this.description());
    this.seoMetadata.keywords.set(this.keywords());
    this.store.clearOrder();
  }

  ngOnInit() {
    this.store.clearOrder();
    this.zone.run(() => {
      
      //this.posts$ = from(client.fetch(POSTS_QUERY));

      this.hasLoaded = true;
      });
  }

  public urlFor = urlFor;
}