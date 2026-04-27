import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BasketStore } from '../../services/basket';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-modal.html',
  styleUrl: './terms-modal.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TermsModalComponent implements OnInit {
  public store = inject(BasketStore);
  private router = inject(Router)
  basket = this.store.basket$;

  currentShow = input.required<boolean>();

  currentShowChange = output<boolean>();

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