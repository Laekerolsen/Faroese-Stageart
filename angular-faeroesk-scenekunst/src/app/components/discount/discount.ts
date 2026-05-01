import { ChangeDetectionStrategy, Component, ErrorHandler, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketStore } from '../../services/basket';
import { FormsModule } from '@angular/forms';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';


@Component({
  selector: 'app-discount-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount.html',
  styleUrl: './discount.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class DiscountComponent  {
  private store = inject(BasketStore);
  basket = this.store.basket$;

  code = '';

  apply() {
    // Fake example — normally from API
    if (this.code === 'SAVE10') {
      this.store.applyDiscount({
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        isActive: true
      });
    }
  }
}