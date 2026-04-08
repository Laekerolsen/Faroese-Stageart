import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { PostComponent } from './pages/post/post';
import { PrivatlivspolitikComponent } from './pages/privatlivspolitik/privatlivspolitik';
import { BilletbetingelserComponent } from './pages/billetbetingelser/billetbetingelser';
import { CookiesComponent } from './pages/cookies/cookies';
import { HandelsbetingelserComponent } from './pages/handelsbetingelser/handelsbetingelser';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'privatlivspolitik', component: PrivatlivspolitikComponent },
  { path: 'cookiepolitik', component: CookiesComponent },
  { path: 'billetbetingelser', component: BilletbetingelserComponent },
  { path: 'handelsbetingelser', component: HandelsbetingelserComponent },
  { path: 'salg/:slug', component: PostComponent },
];