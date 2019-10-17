import { Injectable } from '@angular/core';

import { User } from '../../shared/models/user';
import { AppLoadService } from '../../app-load.service';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from './spinner.service';
import { ErrorService } from './error.service';
import { catchError, tap } from 'rxjs/operators';
import { ERROR } from '@angular/compiler-cli/ngcc/src/logging/console_logger';
import { Router } from '@angular/router';
import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  redirectUrl: string;
  private api = 'https://fes-todo-api.herokuapp.com/api';


  get isLoggedIn(): boolean {
   return !!this.user;
  }

  constructor(private appLoadService: AppLoadService,
              private http: HttpClient,
              private spinnerService: SpinnerService,
              private errorService: ErrorService,
              private router: Router) {
    this.user = this.appLoadService.user;
  }

  saveUser<T>(): MonoTypeOperatorFunction<User> {
    return user$ => user$.pipe(tap(user => {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate([this.redirectUrl || '/']);
    }));
  }


  login(username: string): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, {username})
      .pipe(this.saveUser(), catchError(ErrorService.handle));
  }

  logout() {
    // I guess there's no logout api lol
    this.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  signUp(username: string) {
    this.http.post<User>(`${this.api}/user`, {username})
      .pipe(this.saveUser(), catchError(ErrorService.handle)).subscribe();
  }

}
