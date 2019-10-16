import { Injectable } from '@angular/core';
import { User } from './shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {
  user: User;

  constructor() { }

  async initializeUser(): Promise<void> {
    if (!window.document.location.pathname.match('(login|sign-up)')) {
      const localUser = localStorage.getItem('user');
      const user: User = localUser && JSON.parse(localUser);
      if (user) {
        try {
          const payload = {username: user.username};
          const request = new Request('https://fes-todo-api.herokuapp.com/api/login',
            {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: {
                'Content-Type': 'application-json',
                Accept: 'application/json'
              }
            });

          const xhr = new XMLHttpRequest();
          xhr.open('post', 'https://fes-todo-api.herokuapp.com/api/login', false);
          xhr.setRequestHeader('Content-type', 'application/json');
          xhr.onreadystatechange = e => {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                this.user = JSON.parse(xhr.response);
                localStorage.setItem('user', xhr.response);
              } else {
                console.error(`Error response: ${xhr.status}`);
              }
            }
          };
          xhr.send(JSON.stringify(payload));
          //figure out why this isn't working...
          //this.user = await fetch(request).then(u => u.json());
        } catch (e) {
          console.error(e);
          localStorage.removeItem('user');
         // document.location.pathname = '/login';
        }
      }// else document.location.pathname = '/login';
    } else return Promise.resolve();
  }

}
