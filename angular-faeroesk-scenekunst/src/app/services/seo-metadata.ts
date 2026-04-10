import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoMetadata {
  public title: WritableSignal<string> = signal('Færøsk Scenekunst');
  public description: WritableSignal<string> = signal('Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøyene.');
  public keywords: WritableSignal<string> = signal('Færøsk Scenekunst, teater, dans, performancekunst, Færøyene');

  constructor(private titleService: Title, private meta: Meta) {
    effect(() => {
      this.titleService.setTitle(this.title());
    });
    
    effect(() => {
      this.meta.updateTag({
        name: 'description',
        content: this.description()
      });
    });
  }
}
