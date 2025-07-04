import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PAGES } from '../../consts/routes';
import { faCopy, faGear, faHome, faInfoCircle, faPaste } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Page } from '../../interfaces/page.interface';
import { NavigationService } from 'src/app/services/navigation.service';
import { IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { UserMode } from '../../enums/user-mode.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, FontAwesomeModule, IonFooter, IonToolbar]
})
export class NavbarComponent implements OnInit {

  //injections
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly usereService = inject(UserService);

  //data
  protected currentPageRoute = signal('');
  private userMode = this.usereService.currentUserModeReadonly;

  //derived data
  protected pages = computed(() => {
    if (this.userMode() === UserMode.Standard) {
      return [
        PAGES.home,
        PAGES.info
      ];
    }
    return [
      PAGES.home,
      PAGES.templates,
      PAGES.info
    ];
  });

  protected icons = computed(() => {
    if (this.userMode() === UserMode.Standard) {
      return [
        faHome,
        faInfoCircle,
      ]
    }
    return [
      faHome,
      faPaste,
      faInfoCircle,
    ]
  });

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
