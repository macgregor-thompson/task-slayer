import { Component, OnInit } from '@angular/core';

import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'ts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    setTimeout(() => this.spinnerService.stop());
  }

}
