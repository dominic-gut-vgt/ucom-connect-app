import { Pipe, PipeTransform } from '@angular/core';
import { BluetoothCharacteristicInfo } from 'src/app/shared/interfaces/bluetooth-characteristic';

@Pipe({
  name: 'valuetoToCharacteristicInfo',
})
export class ValuetoToCharacteristicInfoPipe implements PipeTransform {
  transform(value: string, infos: BluetoothCharacteristicInfo[]): BluetoothCharacteristicInfo | undefined {
    if (!value || infos.length === 0 || typeof value !== 'string') {
      return undefined;
    }
    return infos.find(info => info.valueKey?.toLowerCase() === value?.toLowerCase());
  }
}