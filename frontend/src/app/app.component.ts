import { Component } from '@angular/core';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderToolbarComponent } from './shared/components/header-toolbar/header-toolbar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonContent, HeaderToolbarComponent,NavbarComponent],
})
export class AppComponent {
  constructor() { }
}
