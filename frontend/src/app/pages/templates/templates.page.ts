import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { faPen, faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { CreateOrUpdateTemplateComponent } from './components/create-or-update-template/create-or-update-template.component';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatButtonModule]
})
export class TemplatesPage {
  //injections
  private dialog = inject(MatDialog);
  private templatesService = inject(TemplatesService);

  //consts
  protected readonly editIcon = faPen;
  protected readonly infoIcon = faInfoCircle;
  protected readonly addIcon = faPlus;

  //data
  protected templates = this.templatesService.templates;

  protected createTemplate(template: Template | undefined = undefined) {
    if (!template) {
      template = EMPTY_OBJECTS.getEmptyUcomConnectTemplate();
    }
    this.dialog.open(CreateOrUpdateTemplateComponent, {
      data: template,
    });
  }

  protected editTemplate(template: Template): void {
    this.createTemplate(template);
  }

}
