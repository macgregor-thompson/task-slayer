import { Component, OnInit } from '@angular/core';

import { SpinnerService } from '../../services/spinner.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'ts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  errorLoggingIn: boolean;

  constructor(private spinnerService: SpinnerService,
              public authService: AuthService) { }

  ngOnInit() {
    setTimeout(() => this.spinnerService.stop());
  }

  login() {
    if (!this.username.length) return;
    this.authService.login(this.username)
      .subscribe(() => this.errorLoggingIn = false, () => this.errorLoggingIn = true);
  }

}
