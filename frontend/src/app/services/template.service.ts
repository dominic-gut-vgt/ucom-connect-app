import { inject, Injectable } from '@angular/core';
import { Template } from '../shared/interfaces/templates/template.interface';
import { UcomConnectSetupTemplateData } from '../shared/interfaces/templates/ucom-connect-template-data.interface';
import { EMPTY_OBJECTS } from '../shared/consts/empty-objects';
import { LocalStorageKey } from '../shared/enums/local-storage-key.enum';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  //injections
  private localStorageService = inject(LocalStorageService);

  //events


  //data
  private templates: Template<UcomConnectSetupTemplateData>[] = [];

  public loadTemplates(): Observable<Template<UcomConnectSetupTemplateData>[]> {
    return new Observable(observer => {
      this.localStorageService.getItem<any[]>(LocalStorageKey.Templates).then(templates => {
        if (templates) {
          this.templates = templates;
          observer.next(this.templates);
          observer.complete();
        }
      }).catch(error => {
        observer.error(error);
        console.error('Error loading templates:', error);
      });
    });
  }
}
