import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SeoMetadata } from '../../services/seo-metadata';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-billetbetingelser',
  standalone: false,
  templateUrl: './billetbetingelser.html',
  styleUrl: './billetbetingelser.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BilletbetingelserComponent implements OnInit {
  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly keywords = signal('');
  seoMetadata: SeoMetadata;

  constructor(private _seoMetadata: SeoMetadata, private route: ActivatedRoute) {
    // Set SEO metadata
    this.seoMetadata = _seoMetadata;

    this.route.data.subscribe(data => {
      this.seoMetadata.title.set(data['title']);
      this.seoMetadata.description.set(data['description']);
      this.seoMetadata.keywords.set(data['keywords']);
    });
  }

  ngOnInit() {
  }
}