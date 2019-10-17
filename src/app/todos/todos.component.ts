import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { fromEvent, Subscription } from 'rxjs';

import { TodoService } from '../core/services/todo.service';
import { Todo } from '../shared/models/todo';
import { SessionService } from '../core/services/session.service';
import { Sorted } from '../shared/models/sorted.enum';
import { SortingTracker } from '../shared/models/sorting-tracker';
import { SortingService } from '../core/services/sorting.service';
import { SpinnerService } from '../core/services/spinner.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'ts-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;

  todos: Todo[];
  todosCopy: Todo[];
  editingTodo: Todo;
  todoChanged: boolean;
  subscriptions = new Subscription();
  sortProperties = ['description', 'complete', 'createdAt'];
  sorter: SortingTracker = new SortingTracker(...this.sortProperties);
  Sorted = Sorted;
  contextMenuPosition = { x: '0px', y: '0px' };
  allCompleted = false;
  pageIndex = 0;
  pageSize = 10;
  numberOfTodos: number;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(private todoService: TodoService,
              public sessionService: SessionService,
              private sortingService: SortingService,
              public spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.getTodos();
    fromEvent(document, 'click').subscribe(() => this.update(this.editingTodo));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todos = todos;
      this.copyAndSort();
    });
  }

  editDescription(todo: Todo): void {
    if (this.editingTodo && this.editingTodo.id !== todo.id) this.todoService.update(todo).subscribe();
    this.editingTodo = todo;
  }

  update(todo: Todo) {
    if (!todo) return;
    this.todoService.update(todo).subscribe();
    this.editingTodo = null;
    this.todoChanged = false;
  }

  updateIfEditing(todo: Todo) {
    if (!this.editingTodo || this.editingTodo.id === todo.id) return;
    this.update(todo);
  }

  delete(todo: Todo, i: number): void {
    this.todoService.delete(todo.id).subscribe(() => {
      this.todos.splice(i, 1);
      const index = this.todosCopy.findIndex(t => t.id === todo.id);
      this.todosCopy.splice(index, 1);
    });
  }

  toggleCompleted($event: MatCheckboxChange, todo: Todo): void {
    todo.complete = $event.checked;
    todo.updatedAt = new Date();
    this.todoChanged = true;
    this.todoService.update(todo).subscribe();
  }

  toggleAllCompleted(): void {
    this.allCompleted = !this.allCompleted;
    this.todos.forEach(t => t.complete = this.allCompleted);
    this.todoService.updateAll(this.todos).subscribe(); // fire and forget for now...
  }

  cloneTodo(todo) {

  }

  dropTodo(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
    this.setSortProperties();
  }

  sortByTitle(order?: Sorted.ascending | Sorted.descending): void {
    SortingService.changeSortDirection(this.sorter, 'description', order ? order : null);
    if (this.sorter.description !== Sorted.false) {
      this.sortingService.sortAlphabetically(this.todos, 'description', this.sorter.description)
        .subscribe(sorted => this.todos = sorted as Todo[]);
    } else this.todos = [...this.todosCopy];
    this.setSortProperties('description');
  }

  sortByCreatedDate(order?: Sorted.ascending | Sorted.descending): void {
    SortingService.changeSortDirection(this.sorter, 'createdAt', order ? order : null);
    if (this.sorter.createdAt !== Sorted.false) {
      this.sortingService.sortByDate(this.todos, 'createdAt', this.sorter.createdAt)
        .subscribe(sorted => this.todos = sorted as Todo[]);
    } else this.todos = [...this.todosCopy];
    this.setSortProperties('createdAt');
  }

  sortByCompleted(order?: Sorted.ascending | Sorted.descending): void {
    SortingService.changeSortDirection(this.sorter, 'complete', order ? order : null);
    if (this.sorter.complete !== Sorted.false) {
      this.sortingService.sortByBoolean(this.todos, 'complete', this.sorter.complete)
        .subscribe(sorted => this.todos = sorted as Todo[]);
    } else this.todos = [...this.todosCopy];
    this.setSortProperties('complete');
  }

  setSortProperties(property?: string): void {
    this.sortProperties.filter(prop => prop !== property).forEach(p => this.sorter[p] = Sorted.false);
    //this.todoservice.updateOrdinals(this.todos);
    if (!property) this.todosCopy = [...this.todos];
  }

  copyAndSort(): void {
    this.todosCopy = [...this.todos];
    const currentSort = SortingService.getCurrentSortProperty(this.sorter);
    if (currentSort) {
      this.sortBy(currentSort as keyof Todo, this.sorter[currentSort] as Sorted.ascending | Sorted.descending);
    }
  }

  sortBy(property: keyof Todo, order?: Sorted.ascending | Sorted.descending): void {
    switch (property) {
      case 'description':
        this.sortByTitle(order);
        break;
      case 'createdAt':
        this.sortByCreatedDate(order);
        break;
      case 'complete':
        this.sortByCompleted(order);
        break;
      // default: don't sort
    }
  }

  openContextMenu(event: MouseEvent, todo: Todo, index: number): void {
    console.log('context click');
    if (!event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { todo, index };
      this.contextMenu.openMenu();
    }
  }

  moveTodo(previousIndex, currentIndex): void {
    moveItemInArray(this.todos, previousIndex, currentIndex);
    this.setSortProperties();
  }

  onPageEvent($event: PageEvent) {
    console.log($event);
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
  }

}
