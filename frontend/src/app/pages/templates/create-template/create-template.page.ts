import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';
import { UcomConnectSetupTemplateData } from 'src/app/shared/interfaces/templates/ucom-connect-template-data.interface';
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.page.html',
  styleUrls: ['./create-template.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateTemplatePage implements OnInit {
  //injections
  private templateService = inject(TemplateService);

  //data
  protected template = signal(EMPTY_OBJECTS.getEmptyUcomConnectTemplate());

  constructor() { }

  ngOnInit() {
    console.log('CreateTemplatePage initialized');
    this.template.set(this.templateService.getCurrentSelectedTemplate());
  }

  private initForm() {

  }

  protected saveTemplate() {

  }

}
