import { Pipe, PipeTransform } from '@angular/core';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { APP_DATA } from 'src/app/shared/consts/app-data';

@Pipe({
  name: 'isUcomConnectDevice',
})
export class IsUcomConnectDevicePipe implements PipeTransform {
  transform(scanResult: ScanResult): boolean {
    if (!scanResult || !scanResult.device || !scanResult.device.name) {
      return false;
    }
    return scanResult.device.name?.includes(APP_DATA.ucomConnectBaseName)
  }
}