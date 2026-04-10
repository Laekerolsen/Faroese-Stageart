import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { PostComponent } from './pages/post/post';
import { PrivatlivspolitikComponent } from './pages/privatlivspolitik/privatlivspolitik';
import { BilletbetingelserComponent } from './pages/billetbetingelser/billetbetingelser';
import { CookiesComponent } from './pages/cookies/cookies';
import { HandelsbetingelserComponent } from './pages/handelsbetingelser/handelsbetingelser';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Færøsk Scenekunst', description: 'Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.', keywords: 'Færøsk Scenekunst, teater, dans, performancekunst, Færøyene' } },
  { path: 'privatlivspolitik', component: PrivatlivspolitikComponent, data: { title: 'Privatlivspolitik - Færøsk Scenekunst', description: 'Læs vores privatlivspolitik for at forstå, hvordan vi håndterer dine data og beskytter dit privatliv, når du besøger Færøsk Scenekunst.', keywords: 'Færøsk Scenekunst, privatlivspolitik, databeskyttelse, personlige oplysninger' } },
  { path: 'cookiepolitik', component: CookiesComponent, data: { title: 'Cookiepolitik - Færøsk Scenekunst', description: 'Læs vores cookiepolitik for at forstå, hvordan vi bruger cookies og lignende teknologier, når du besøger Færøsk Scenekunst.', keywords: 'Færøsk Scenekunst, cookiepolitik, cookies, webteknologier' } },
  { path: 'billetbetingelser', component: BilletbetingelserComponent, data: { title: 'Billetbetingelser - Færøsk Scenekunst', description: 'Læs vores billetbetingelser for at forstå dine rettigheder og forpligtelser ved køb af billetter til færøske teaterforestillinger.', keywords: 'Færøsk Scenekunst, billetbetingelser, teater, billetter' } },
  { path: 'handelsbetingelser', component: HandelsbetingelserComponent, data: { title: 'Handelsbetingelser - Færøsk Scenekunst', description: 'Læs vores handelsbetingelser for at forstå dine rettigheder og forpligtelser ved køb af varer og tjenester fra Færøsk Scenekunst.', keywords: 'Færøsk Scenekunst, handelsbetingelser, varer, tjenester' } },
  { path: 'salg/:slug', component: PostComponent, data: { title: '1 Færøsk Scenekunst', description: 'Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.', keywords: 'Færøsk Scenekunst, teater, dans, performancekunst, Færøyene' } },
];