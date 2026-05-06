import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { BasketStore } from '../../../services/basket';
import { timer } from 'rxjs';

@Component({
  selector: 'app-orderslist',
  standalone: false,
  templateUrl: './orderslist.html',
  styleUrl: './orderslist.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OrdersListPageComponent {

  constructor(private store: BasketStore) {
  }

  showList = computed(() => {
    const raw = localStorage.getItem(this.store.storageOrdersListKey);

    //this.OldOrdersListAsSignal.set(raw ? JSON.parse(raw) : []);

    const list = raw ? JSON.parse(raw) : [];

    this.showComponent = list.length > 0;

    return list.length > 0;
  });

  showComponent: boolean = true;

  clearOldOrders() {
    this.showComponent = false;
    this.store.clearOldOrders();
  }
}