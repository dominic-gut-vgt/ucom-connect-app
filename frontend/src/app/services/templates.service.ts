import { inject, Injectable, signal } from '@angular/core';
import { Template } from '../shared/interfaces/templates/template.interface';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKey } from '../shared/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  //injections
  private localStorageService = inject(LocalStorageService);

  //data
  public templates = signal<Template[]>([]);

  constructor() {
    this.loadTemplates();
  }

  public loadTemplates(): void {
    this.localStorageService.getItem<Template[]>(LocalStorageKey.Templates).then((templates) => {
      if (templates) {
        this.templates.set(templates);
      }
    });
  }

  public saveTemplate(template: Template): Promise<void> {
    if (!this.templates().find(t => t.id === template.id)) {
      this.templates.update((state) => {
        let updatedTemplates = [...state];
        updatedTemplates.push(template);
        return updatedTemplates;
      });
    } else {
      this.templates.set(this.templates().map(c => c.id === template.id ? template : c));
    }
    return this.saveTemplates(this.templates());
  }

  public saveTemplates(templates: Template[]): Promise<void> {
    this.templates.set(templates);
    return this.localStorageService.setItem(LocalStorageKey.Templates, templates)
  }


  public deleteTemplate(template: Template): Promise<void> {
    this.templates.set(this.templates().filter(c => c.id !== template.id));
  return  this.localStorageService.setItem(LocalStorageKey.Templates, this.templates)
  }

}
