import { Pipe, PipeTransform } from '@angular/core';

import { Todo } from '../models/todo';
import { FilterBy } from '../models/filter-by.enum';

@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {

  transform(todos: Todo[], status: FilterBy): Todo[] {
    // FilterBy.all is 0 so will be falsy
    if (!todos || !status) return todos;
    return todos.filter(t => status === FilterBy.complete ? !!t.complete : !t.complete);
  }

}
