import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { faPen, faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TemplateService } from 'src/app/services/template.service';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';
import { UcomConnectSetupTemplateData } from 'src/app/shared/interfaces/templates/ucom-connect-template-data.interface';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { CreateOrUpdateTemplateComponent } from './components/create-or-update-template/create-or-update-template.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatButtonModule]
})
export class TemplatesPage {

  //injections
  private templateService = inject(TemplateService);
  readonly dialog = inject(MatDialog);

  //consts
  protected readonly editIcon = faPen;
  protected readonly infoIcon = faInfoCircle;
  protected readonly addIcon = faPlus;

  //data
  protected templates = signal<Template<UcomConnectSetupTemplateData>[]>([]);

  ngOnInit() {
    this.templateService.loadTemplates().subscribe((templates) => {
      this.templates.set(templates);
    });
  }

  editTemplate(template: Template<UcomConnectSetupTemplateData>) {
    this.dialog.open(CreateOrUpdateTemplateComponent, {
      data: template,
    });
  }

  createTemplate() {
    let template = EMPTY_OBJECTS.getEmptyUcomConnectTemplate();
    this.dialog.open(CreateOrUpdateTemplateComponent, {
      data: template,
    });
  }

}
