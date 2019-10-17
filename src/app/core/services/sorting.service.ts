import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SortingTracker } from '../../shared/models/sorting-tracker';
import { Sorted } from '../../shared/models/sorted.enum';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  static changeSortDirection(list: SortingTracker, property: string, direction?: Sorted): void {
    if (direction) {
      list[property] = direction;
    } else if (list[property] === Sorted.descending) {
      list[property] = Sorted.false;
    } else {
      list[property]++;
    }
  }

  static getCurrentSortProperty(obj: SortingTracker): string | undefined {
    return Object.keys(obj).find((key: string) => obj[key] === Sorted.ascending || obj[key] === Sorted.descending);
  }

  constructor() { }

  sortAlphabetically<T>(list: Array<T>, property: string, sortOrder: Sorted): Observable<Array<T>> {
    const newList = [...list];
    const ascending = sortOrder === Sorted.ascending;
    return of(newList.sort((a, b) => {
      const stringA = a[property].toLocaleLowerCase();
      const stringB = b[property].toLocaleLowerCase();
      return ascending ?
        stringA < stringB ? -1 : stringB < stringA ? 1 : 0
        : stringB < stringA ? -1 : stringA < stringB ? 1 : 0;
    }));
  }

  sortByDate<T>(list: Array<T>, property: string, sortOrder?: Sorted): Observable<Array<T>> {
    const newList = [...list];
    const ascending = sortOrder === Sorted.ascending;
    return of(newList.sort((a, b) => {
      const dateA = a[property] ? new Date(a[property]).getTime() : 0;
      const dateB = b[property] ? new Date(b[property]).getTime() : 0;
      return ascending ? dateA - dateB : dateB - dateA;
    }));
  }

  sortByBoolean<T>(list: Array<T>, property: string, sortOrder?: Sorted): Observable<Array<T>> {
    const newList = [...list];
    const ascending = sortOrder === Sorted.ascending;
    return of(newList.sort((a, b) => ascending ? a[property] - b[property] : b[property] - a[property]));
  }


}
