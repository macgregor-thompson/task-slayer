import { Pipe, PipeTransform } from '@angular/core';

import filter from 'lodash/filter';

import { Todo } from '../models/todo';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(todos: Todo[], input: string, ...otherProperties: string[]): Todo[] {
    if (!todos || !input) return todos;
    input = input.toLocaleLowerCase();
    return filter(todos, todo => {
      if (todo.description && todo.description.toLocaleLowerCase().includes(input)) return true;
      otherProperties.forEach(prop => {
        if (todo[prop].toLocaleLowerCase().includes(input)) return true;
      });
      return false;
    });
  }

}
