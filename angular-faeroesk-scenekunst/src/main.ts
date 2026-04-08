//import { bootstrapApplication } from '@angular/platform-browser';
import { platformBrowser } from '@angular/platform-browser';
//import { appConfig } from './app/app.config';
//import { App } from './app/app';

//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowser()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));