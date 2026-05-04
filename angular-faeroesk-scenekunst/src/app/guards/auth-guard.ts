import { Injectable, Signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BasketStore } from '../services/basket';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { permission } from 'process';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  store: BasketStore;
  breakpointObserver: BreakpointObserver;
  isPhone$: Observable<BreakpointState>;
  isPhone: Signal<BreakpointState | undefined>;
  constructor(private router: Router, private _store: BasketStore, private _breakpointObserver: BreakpointObserver) {
    this.breakpointObserver = _breakpointObserver;
    this.store = _store;

    this.isPhone$ = this.breakpointObserver.observe([Breakpoints.Handset]);
    this.isPhone = toSignal(this.isPhone$);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // replace with real auth logic
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const requiredPermissions: string[] = route.data['permissions'];
    const RedirectUrl: string = route.data['redirecturl'] || '/';

    if (requiredPermissions?.length > 0)
    {
      const IsConfirmedRequired = requiredPermissions.filter(permission => permission === 'isconfirmed')?.length > 0;
      const IsHasAddressRequired = requiredPermissions.filter(permission => permission === 'hasaddress')?.length > 0;
      const IsLoginRequired = requiredPermissions.filter(permission => permission === 'islogin')?.length > 0;
      const IsHasLinesRequired = requiredPermissions.filter(permission => permission === 'haslines')?.length > 0;
      const IsHasPaymentRequired = requiredPermissions.filter(permission => permission === 'haspayment')?.length > 0;

      const hasLines = this.store.basket().lines.length > 0 || false;
      const hasPayment = this.store.order().orderStatus === 'confirmed' || false;

      console.log(this.store.TermsAccepted(), this.store.AddressConfirmed(), hasLines, hasPayment);

      if (IsLoginRequired && this.isLoggedIn)
      {
        if (this.isLoggedIn)
        {
          if ((IsConfirmedRequired && !this.store.TermsAccepted()) || (IsHasAddressRequired && !this.store.AddressConfirmed()) || (IsHasLinesRequired && !hasLines) || (IsHasPaymentRequired && !hasPayment))
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }
          else if (IsConfirmedRequired && !this.store.TermsAccepted())
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }
          else if (IsHasAddressRequired && !this.store.AddressConfirmed())
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }
          else if (IsHasLinesRequired && !hasLines)
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }

          return true;
        }
        else
        {
          this.router.navigate([RedirectUrl]);
          return false;
        }
      }
      else
      {
        if ((IsConfirmedRequired && !this.store.TermsAccepted()) || (IsHasAddressRequired && !this.store.AddressConfirmed()) || (IsHasLinesRequired && !this.store.basket().lines.length) || (IsHasPaymentRequired && !hasPayment))
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }
          else if (IsConfirmedRequired && !this.store.TermsAccepted())
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }
          else if (IsHasAddressRequired && !this.store.AddressConfirmed())
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }
          else if (IsHasLinesRequired && !this.store.basket().lines.length)
          {
            this.router.navigate([RedirectUrl]);
            return false;
          }

        return true;
      }
    }

    this.router.navigate([RedirectUrl]);
    return false;
  }
}