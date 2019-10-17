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
import { FilterBy } from '../shared/models/filter-by.enum';

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
  newDescription = '';
  activeFilter: FilterBy = FilterBy.all;
  FilterBy = FilterBy;
  numberRemaining: number;
  numberCompleted: number;

  // might add in pagination later...but again since I can't control the server side code, I might now
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
    fromEvent(document, 'click').subscribe(() => this.update());
    this.subscriptions.add(this.sessionService.refresh$.subscribe(() => this.getTodos()));
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

  createTodo(description = this.newDescription) {
    if (!description.length) return;
    const newTodo = new Todo(description);
    this.todoService.createTodo(newTodo).subscribe(todo => {
      this.newDescription = '';
      this.todos.push(todo);
      this.copyAndSort();
    });
  }

  editDescription(todo: Todo): void {
    if (this.editingTodo && this.editingTodo.id !== todo.id) this.todoService.update(todo).subscribe();
    this.editingTodo = todo;
  }

  update(todo = this.editingTodo): void {
    if (!todo || !this.todoChanged) return this.editingTodo = null;
    this.todoService.update(todo).subscribe();
    this.editingTodo = null;
    this.todoChanged = false;
  }

  updateIfEditing(todo: Todo): void {
    if (!this.editingTodo || this.editingTodo.id === todo.id) return;
    this.update(todo);
  }

  delete(todo: Todo, i: number): void {
    this.todoService.delete(todo.id).subscribe(() => {
      this.todos.splice(i, 1);
      const index = this.todosCopy.findIndex(t => t.id === todo.id);
      this.todosCopy.splice(index, 1);
      this.setNumberCompletedAndIncomplete();
      if (this.editingTodo && this.editingTodo.id === todo.id) this.editingTodo = null;
    });
  }

  toggleCompleted($event: MatCheckboxChange, todo: Todo): void {
    todo.complete = $event.checked;
    todo.updatedAt = new Date();
    this.todoChanged = true;
    this.setNumberCompletedAndIncomplete();
    this.todoService.update(todo).subscribe();
  }

  toggleAllCompleted(): void {
    this.allCompleted = !this.allCompleted;
    this.todos.forEach(t => t.complete = this.allCompleted);
    this.setNumberCompletedAndIncomplete();
    this.todoService.updateAll(this.todos).subscribe(); // fire and forget for now...
  }

  deleteCompleted(): void {
    const completedIds = this.todos.filter(t => t.complete).map(t => t.id);
    this.todoService.deleteMany(completedIds).subscribe(() => this.getTodos());
  }


  setNumberCompletedAndIncomplete(): void {
    // it would be easier to put this in the view, but having functions in the view isn't the best practice as they are called
    // every change detection cycle
    this.numberRemaining = this.todos && this.todos.filter(t => !t.complete).length;
    this.numberCompleted = this.todos && this.todos.filter(t => !!t.complete).length;
    this.allCompleted = this.todos && this.todos.length === this.numberCompleted;
  }

  // Sorting and other stuff

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
    // this is where I would update the order of the list if I could
    if (!property) this.todosCopy = [...this.todos];
  }

  copyAndSort(): void {
    this.todosCopy = [...this.todos];
    this.setNumberCompletedAndIncomplete();
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
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
  }

}
