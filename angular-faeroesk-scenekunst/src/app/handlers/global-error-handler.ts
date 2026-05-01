import { ErrorHandler, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    
  handleError(error: any): void {
    // Log to console
    console.error('Global error caught:', error);

    // Send to logging service (API, App Insights, etc.)
    // this.loggingService.log(error);

    // Optional: show user-friendly message
    this.snackbar.open('Global error caught:' + error, 'Close', {
        duration: 3000
    });
  }

  snackbar: MatSnackBar;

  constructor(private _snackBar: MatSnackBar){
    this.snackbar = _snackBar;
  }
}