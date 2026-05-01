import { ChangeDetectionStrategy, Component, effect, ErrorHandler, inject, input, OnInit, output, signal } from '@angular/core';
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

  constructor(){
    

    effect(() => {
      const b = this.store.basket();
      if (!b) return;

      let signalBool = this.currentShow();

      this.ShowModal.set(signalBool);
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

  openModal() {
    this.ShowModal.set(true);
    this.currentShowChange.emit(!this.currentShow());
  }

  toggle() {
    this.currentShowChange.emit(!this.currentShow());
    this.ShowModal.set(!this.currentShow());
  }
}