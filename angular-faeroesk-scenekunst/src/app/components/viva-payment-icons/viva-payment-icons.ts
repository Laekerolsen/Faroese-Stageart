import { ChangeDetectionStrategy, Component, ErrorHandler, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandler } from '../../handlers/global-error-handler';

@Component({
  selector: 'app-viva-payment-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viva-payment-icons.html',
  styleUrl: './viva-payment-icons.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class VivaPaymentIconsComponent {
  showHeader = input.required<boolean | undefined>();
  
  get Show()
  {
    if (this.showHeader())
      return true;
    else
      return false;
  }

  get TopClass()
  {
    if (!this.Show)
      return "top-icons-div"
    else
      return "other-icons-div"
  }
}