import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { client } from '../../sanity/client';
import { NgZone } from '@angular/core';
import { from } from 'rxjs';

const POSTS_QUERY = `*[_type == "post"&& defined(slug.current)]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HomeComponent implements OnInit {
  posts$ = from(client.fetch(POSTS_QUERY));

  public posts: any[] = [];
  public hasLoaded: boolean = false;
  private zone: NgZone;

  constructor(private ngZone: NgZone) {
    this.zone = ngZone;
    console.log('HomeComponent constructor called');
  }

  ngOnInit() {
    //this.posts = await client.fetch(POSTS_QUERY);
    console.log('HomeComponent ngOnInit called');
    this.zone.run(() => {
      
      this.posts$ = from(client.fetch(POSTS_QUERY));

      console.log('Fetched posts in ngOnInit:', this.posts$);

      this.hasLoaded = true;
      });
  }
}