import { Component, inject, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss'],
  imports: [
    IonHeader, IonToolbar
  ]
})
export class HeaderToolbarComponent implements OnInit {

  //injections
  private readonly navigationService = inject(NavigationService);

  //data
  protected currentPageName = signal('');

  constructor() { }

  ngOnInit() {
    this.navigationService.currentPageUpdated.subscribe((page) => {
      this.currentPageName.set(page.name);
    });
    this.currentPageName.set(this.navigationService.getCurrentPageName());
  }

}
