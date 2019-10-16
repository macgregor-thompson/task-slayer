import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';

import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private spinnerService: SpinnerService) { }

  static handle(e) {
    let errorMessage: string;
    if (e.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${e.error.message}`;
    } else {
      errorMessage = `Backend returned code ${e.code}: ${e.message}`;
    }
    console.error(e);
    return throwError(errorMessage);
  }

  oops(e) {
    // like above, but will stop the spinner
    this.spinnerService.stop();
    let errorMessage: string;
    if (e.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${e.error.message}`;
    } else {
      errorMessage = `Backend returned code ${e.code}: ${e.message}`;
    }
    console.error(e);
    return throwError(errorMessage);
  }

}
