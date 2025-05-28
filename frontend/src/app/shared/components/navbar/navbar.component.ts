import { Component, inject, OnInit, signal } from '@angular/core';
import { PAGES } from '../../consts/routes';
import { faCopy, faGear, faHome, faInfoCircle, faPaste } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Page } from '../../interfaces/page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { IonFooter } from '@ionic/angular/standalone';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, FontAwesomeModule, IonFooter]
})
export class NavbarComponent implements OnInit {

  //injections
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  //consts
  protected readonly pages = [
    PAGES.home,
    PAGES.templates,
    PAGES.info
  ];
  protected readonly icons = [
    faHome,
    faPaste,
    faInfoCircle,
  ];

  //data
  protected currentPageRoute = signal('');

  constructor() {
    this.navigationService.currentPageUpdated.subscribe((page) => {
      this.currentPageRoute.set(page.route);
    });
  }

  ngOnInit() { }


  protected routeToPage(page: Page): void {
    this.router.navigate([page.route]);
  }

}
