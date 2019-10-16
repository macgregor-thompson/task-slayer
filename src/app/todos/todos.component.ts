import { Component, OnInit } from '@angular/core';

import { TodoService } from '../core/services/todo.service';
import { Todo } from '../shared/models/todo';

@Component({
  selector: 'ts-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos: Todo[];

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    this.todoService.getTodos().subscribe((todos: Todo[]) => this.todos = todos);
  }

}
