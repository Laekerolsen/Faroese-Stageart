import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { client } from '../../sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SeoMetadata } from '../../services/seo-metadata';
import { toSignal } from '@angular/core/rxjs-interop';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
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
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.html',
  styleUrls: ['./post.css'],
})
export class PostComponent implements OnInit {
  public slug: string | null;
  //public post$ = from(Promise.resolve(null)); // placeholder
  public post$: Observable<Post | null>; // <-- explicitly typed

  protected readonly title = signal('Færøsk Scenekunst');
  protected readonly description = signal('Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.');
  protected readonly keywords = signal('Færøsk Scenekunst, teater, dans, performancekunst, Færøyene');
  seoMetadata: SeoMetadata;

  public content(input: Post): any[] {
    console.log(typeof input); 
    let parsedValue: any[] = [];
    
    input.body?.forEach((block: any) => {
      if (block._type === 'block') {
        parsedValue.push({ type: 'text', content: block.children.map((child: any) => child.text).join(' ') });
      } else if (block._type === 'image') {
        parsedValue.push({ type: 'image', url: urlFor(block).url() });
      }
    });

    return parsedValue;
  }

  constructor(private route: ActivatedRoute, private _seoMetadata: SeoMetadata) {
    this.slug = this.route.snapshot.paramMap.get('slug');
    // Set SEO metadata
    this.seoMetadata = _seoMetadata;

    if (this.slug) {
      this.post$ = from(client.fetch<Post>(POST_QUERY, { slug: this.slug }));
    } else {
      this.post$ = from(Promise.resolve(null));
    }

    this.postInline = toSignal(this.post$, { initialValue: null });

    this.initPost();
  }

  initPost() { 
    effect(() => {
      const p = this.postInline();
      if (!p) return;

      this.title.set(p.title || '');

      const descriptionText =
        p.body?.find((block: any) => block._type === 'block')
          ?.children.map((child: any) => child.text).join(' ') || '';

      this.description.set(descriptionText);

      this.seoMetadata.title.set(this.title());
      this.seoMetadata.description.set(this.description());
      this.seoMetadata.keywords.set(this.keywords());
    });
  }

  postInline: Signal<Post | null | undefined>;

  ngOnInit() {
  }

  public urlFor = urlFor;
}