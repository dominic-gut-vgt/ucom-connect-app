import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, IonRouterOutlet]
})
export class TemplatesPage {

 

}
