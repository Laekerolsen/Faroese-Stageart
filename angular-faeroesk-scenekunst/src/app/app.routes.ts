import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { PostComponent } from './pages/post/post';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':slug', component: PostComponent },
];