import { Pipe, PipeTransform } from '@angular/core';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { APP_DATA } from 'src/app/shared/consts/app-data';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';

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