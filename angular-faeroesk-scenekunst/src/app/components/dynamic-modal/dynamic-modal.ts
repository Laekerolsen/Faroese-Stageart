import { ChangeDetectionStrategy, Component, effect, ErrorHandler, inject, input, OnInit, output, Renderer2, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BasketStore } from '../../services/basket';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-modal.html',
  styleUrl: './dynamic-modal.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class DynamicModalComponent implements OnInit {
  public store = inject(BasketStore);
  private router = inject(Router)
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  basket = this.store.basket$;

  currentShow = input.required<boolean>();

  htmlContent = input.required<string>();

  currentShowChange = output<boolean>();

  safeHtml!: SafeHtml;

  constructor(private renderer: Renderer2){
    

    effect(() => {
      const b = this.store.basket();
      if (!b) return;

      let signalBool = this.currentShow();

      this.ShowModal.set(signalBool);
      
      if (signalBool === true)
        this.disableScroll();
      else
        this.enableScroll();

    });
  }

  ngOnInit(): void {
    this.ShowModal.set(this.currentShow());

    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent());
  }

  public ShowModal = signal(false);

  get Show()
  {
    if (this.ShowModal())
      return true;
    else
      return false;
  }

  disableScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  enableScroll() {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  openModal() {
    this.ShowModal.set(true);
    this.disableScroll();
    this.currentShowChange.emit(!this.currentShow());
  }

  toggle() {
    this.currentShowChange.emit(!this.currentShow());
    this.ShowModal.set(!this.currentShow());

    if (this.ShowModal() === true)
      this.disableScroll();
    else
      this.enableScroll();
  }
}