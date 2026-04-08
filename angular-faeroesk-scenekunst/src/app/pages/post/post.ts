import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { client } from '../../sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const builder = createImageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

@Component({
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent implements OnInit {
  post: any;
  imageUrl: string | null = null;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.post = await client.fetch(POST_QUERY, { slug });

    if (this.post?.image) {
      this.imageUrl = urlFor(this.post.image)
        .width(550)
        .height(310)
        .url();
    }
  }
}
