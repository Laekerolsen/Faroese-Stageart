import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SeoMetadata } from './services/seo-metadata';
import { BasketComponent } from './components/basket/basket';
import { BasketStore } from './services/basket';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Færøsk Scenekunst');
  protected readonly description = signal('Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.');
  protected readonly keywords = signal('Færøsk Scenekunst, teater, dans, performancekunst, Færøyene');
  currentYear = new Date().getFullYear();
  seoMetadata: SeoMetadata;

  route: ActivatedRoute;

  store: BasketStore;

  public basket: ReturnType<BasketStore['basket$']>;

  constructor(private _seoMetadata: SeoMetadata, private activatedRoute: ActivatedRoute, private basketStore: BasketStore) {
    this.store = basketStore;
    this.basket = this.store.basket$();
    this.route = activatedRoute;
    this.seoMetadata = _seoMetadata;
    this.seoMetadata.title.set(this.title());
    this.seoMetadata.description.set(this.description());
    this.seoMetadata.keywords.set(this.keywords());

    this.route.data.subscribe(data => {
      this.seoMetadata.title.set(data['title']);
      this.seoMetadata.description.set(data['description']);
      this.seoMetadata.keywords.set(data['keywords']);
    });
  }
}
