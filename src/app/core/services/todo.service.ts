import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { forkJoin, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ErrorService } from './error.service';
import { Todo } from '../../shared/models/todo';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoApi = 'https://fes-todo-api.herokuapp.com/api/todo';

  newToDo$ = new Subject<Todo>();

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService,
              private errorService: ErrorService) { }

  getTodos(): Observable<Todo[]> {
    this.spinnerService.start();
    return this.http.get<Todo[]>(this.todoApi)
      .pipe(
        map(todos => todos || []),
        this.stopSpinner(),
        catchError(e => this.errorService.oops(e)));
  }

  createTodo(todo: Partial<Todo>): Observable<Todo> {
    this.spinnerService.start();
    return this.http.post<Todo>(this.todoApi, todo)
      .pipe(
        tap(t => {
          this.newToDo$.next(t);
          this.spinnerService.stop();
        }),
        catchError(e => this.errorService.oops(e)));
  }

  getTodoById(id: string): Observable<Todo> {
    this.spinnerService.start();
    return this.http.get<Todo>(`${this.todoApi}/${id}`)
      .pipe(this.stopSpinner(), catchError(e => this.errorService.oops(e)));
  }

  delete(id: string): Observable<string> {
    this.spinnerService.start();
    // @ts-ignore
    return this.http.delete<string>(`${this.todoApi}/${id}`, { responseType: 'text' })
      .pipe(this.stopSpinner(), catchError(e => this.errorService.oops(e)));
  }

  deleteMany(ids: string[]): Observable<string[]> {
    this.spinnerService.start();
    const observables: Observable<string>[] = [];
    ids.forEach(id => {
      observables.push(this.delete(id));
    });
    return forkJoin(observables);
  }

  update(todo: Partial<Todo>): Observable<Todo> {
    this.spinnerService.start();
    const { description, complete } = todo;
    return this.http.put<Todo>(`${this.todoApi}/${todo.id}`, { description, complete })
      .pipe(this.stopSpinner(), catchError(e => this.errorService.oops(e)));
  }

  // there's no update all method on the server so this will have to do...
  updateAll(todos: Todo[]): Observable<Todo[]> {
    this.spinnerService.start();
    const observables: Observable<Todo>[] = [];
    todos.forEach(todo => {
      observables.push(this.update(todo));
    });
    return forkJoin(observables);
  }

  stopSpinner<T>(): MonoTypeOperatorFunction<T> {
    return input$ => input$.pipe(
      tap(() => {
        this.spinnerService.stop();
      }));
  }


}
