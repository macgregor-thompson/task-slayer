import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  primary = false;
  auxiliary = false;

  constructor() { }

  start() {
    if (!this.primary) this.primary = true;
  }

  startAuxiliary() {
    if (!this.auxiliary) this.auxiliary = true;
  }

  stop() {
    this.primary = false;
    this.auxiliary = false;
  }

  stopAuxiliary() {
    this.auxiliary = false;
  }

  stopPrimary() {
    this.primary = false;
  }
}
