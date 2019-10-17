import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { SpinnerService } from './core/services/spinner.service';

@Component({
  selector: 'ts-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public router: Router,
              public spinnerService: SpinnerService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.spinnerService.start();
    });
  }

}
