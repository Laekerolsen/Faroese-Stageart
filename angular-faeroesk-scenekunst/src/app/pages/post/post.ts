import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { client } from '../../sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

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
export class PostComponent {
  public slug: string | null;
  //public post$ = from(Promise.resolve(null)); // placeholder
  public post$: Observable<Post | null>; // <-- explicitly typed

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

  constructor(private route: ActivatedRoute) {
    this.slug = this.route.snapshot.paramMap.get('slug');

    if (this.slug) {
      this.post$ = from(client.fetch<Post>(POST_QUERY, { slug: this.slug }));
    } else {
      this.post$ = from(Promise.resolve(null));
    }
  }

  public urlFor = urlFor;
}