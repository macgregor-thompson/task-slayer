import { Injectable } from '@angular/core';

import { User } from '../../shared/models/user';
import { AppLoadService } from '../../app-load.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(private appLoadService: AppLoadService) {
    this.user = this.appLoadService.user;
  }


  login() {

  }


  logout() {

  }

  signUp() {

  }

}
