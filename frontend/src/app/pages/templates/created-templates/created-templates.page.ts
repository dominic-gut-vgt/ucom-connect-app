import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { faPen, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PAGES } from 'src/app/shared/consts/routes';
import { LocalStorageKey } from 'src/app/shared/enums/local-storage-key.enum';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';
import { UcomConnectSetupTemplateData } from 'src/app/shared/interfaces/templates/ucom-connect-template-data.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-created-templates',
  templateUrl: './created-templates.page.html',
  styleUrls: ['./created-templates.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class CreatedTemplatesPage implements OnInit {
  //injections
  private localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  //consts
  protected readonly editIcon = faPen;
  protected readonly infoIcon = faInfoCircle

  //data
  protected templates = signal<Template<UcomConnectSetupTemplateData>[]>([]);


  ngOnInit() {
    this.loadTemplates();
  }


  loadTemplates() {
    this.localStorageService.getItem<any[]>(LocalStorageKey.Templates).then(templates => {
      if (templates) {
        this.templates.set(templates);
      }
    }).catch(error => {
      console.error('Error loading templates:', error);
    });
  }

  createTemplate() {
    this.router.navigate([PAGES.createTemplate.route]);
  }

}
