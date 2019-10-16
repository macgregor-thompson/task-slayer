import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ErrorService } from './error.service';
import { Todo } from '../../shared/models/todo';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoApi = 'https://fes-todo-api.herokuapp.com/api/todo';

  newToDo$ = new Subject<Todo[]>();
  createdTodo = new Subject<Todo>();

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService,
              private errorService: ErrorService) { }

  getTodos(): Observable<Todo[]> {
    this.spinnerService.start();
    return this.http.get<Todo[]>(this.todoApi)

      .pipe(
        tap(() => {
          this.spinnerService.stop();
        }),
        //catchError(ErrorService.handle));
        catchError(e => this.errorService.oops(e)));
  }
}
