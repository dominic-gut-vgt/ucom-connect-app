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
import { SettingsStore } from '../../stores/settings/settings-store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, FontAwesomeModule, IonFooter, IonToolbar]
})
export class NavbarComponent implements OnInit {

  //injections
  private router = inject(Router);
  private navigationService = inject(NavigationService);
  private settingsStore=inject(SettingsStore);
  
 // private readonly usereService = inject(UserService);

  //data
  protected currentPageRoute = signal('');
  private userMode = this.settingsStore.settings.userMode;

  //derived data
  protected pages = computed(() => {
    if (this.userMode() === UserMode.Standard) {
      return [
        PAGES.home,
        PAGES.settings,
        PAGES.info
      ];
    }
    return [
      PAGES.home,
      PAGES.settings,
      PAGES.templates,
      PAGES.info
    ];
  });

  protected icons = computed(() => {
    switch (this.userMode()) {
      case UserMode.Standard: return [
        faHome,
        faGear,
        faInfoCircle,
      ];
      default: return [
        faHome,
        faGear,
        faPaste,
        faInfoCircle,
      ];
    }
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
