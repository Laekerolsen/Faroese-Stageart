import { ChangeDetectionStrategy, Component, effect, ErrorHandler, inject, input, OnInit, output, Renderer2, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BasketStore } from '../../services/basket';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';

@Component({
  selector: 'app-delivery-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-modal.html',
  styleUrl: './delivery-modal.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class DeliveryModalComponent implements OnInit {
  public store = inject(BasketStore);
  private router = inject(Router)
  basket = this.store.basket$;

  currentShow = input.required<boolean>();

  currentShowChange = output<boolean>();

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

  disableScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  enableScroll() {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  ngOnInit(): void {
    this.ShowModal.set(this.currentShow());
  }

  public ShowModal = signal(false);

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