import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';

import { App } from './app';
import { HomeComponent } from './pages/home/home';
import { PostComponent } from './pages/post/post';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    App,
    HomeComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RouterOutlet
  ],
  bootstrap: [App]
})
export class AppModule {}