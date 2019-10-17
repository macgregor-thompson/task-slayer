import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private pageTitle: BehaviorSubject<string> = new BehaviorSubject('To-Do\'s');
  readonly pageTitle$: Observable<string> = this.pageTitle.asObservable();

  refresh$ = new Subject();
  searchInput = '';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.initPageTitleObservable();
  }

  initPageTitleObservable(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    )
      .subscribe(data => {
        this.pageTitle.next(data.title);
        document.title = `${ data.title } | Task Slayer`;
      });
  }
}
