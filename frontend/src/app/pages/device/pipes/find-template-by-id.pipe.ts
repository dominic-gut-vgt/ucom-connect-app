import { Pipe, PipeTransform } from '@angular/core';
import { BluetoothCharacteristicInfo } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';

@Pipe({
  name: 'findTemplateById',
})
export class FindTemplateByIdPipe implements PipeTransform {
  transform(id: string, templates: Template[]): Template | undefined {
    if (!id || typeof id !== 'string' || templates.length === 0) {
      return undefined;
    }
    return templates.find(template => template.id === id);
  }
}