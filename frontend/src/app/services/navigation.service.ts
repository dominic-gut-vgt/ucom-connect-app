import { EventEmitter, inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Page } from '../shared/interfaces/page.interface';
import { PAGES } from '../shared/consts/routes';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  //injections
  private readonly router = inject(Router);

  public currentPageUpdated = new EventEmitter<Page>();

  private currentPage: Page = { route: '', name: '' }
  constructor() {
    this.init();
  }

  private init(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        Object.values(PAGES).forEach((page) => {
          if (event.url === `/${page.route}`) {
            this.currentPage = page;
            this.currentPageUpdated.emit(page);
          }
        });
      }
    });
  }

}
