import { Pipe, PipeTransform } from '@angular/core';
import { BluetoothCharacteristic } from '../interfaces/bluetooth-characteristic.interface';

@Pipe({
  name: 'getCharacteristicById',
})
export class GetCharacteristicByIdPipe implements PipeTransform {
  transform(characteristicId: string, allCharacteristics: BluetoothCharacteristic[]): BluetoothCharacteristic | undefined {
    if (!characteristicId || !allCharacteristics) {
      return undefined;
    }

    const foundCharacteristic = allCharacteristics.find(c => c.id === characteristicId);
    return foundCharacteristic;
  }
}