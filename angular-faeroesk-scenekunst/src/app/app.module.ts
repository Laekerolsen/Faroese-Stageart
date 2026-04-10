import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';

import { App } from './app';
import { HomeComponent } from './pages/home/home';
import { PostComponent } from './pages/post/post';
import { routes } from './app.routes';
import { SeoMetadata } from './services/seo-metadata';

@NgModule({
  declarations: [App, HomeComponent, PostComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes), RouterOutlet],
  providers: [SeoMetadata, provideClientHydration(withEventReplay())],
  bootstrap: [App],
})
export class AppModule {}
