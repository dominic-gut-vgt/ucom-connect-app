import { EventEmitter, Injectable } from '@angular/core';
import { BleClient, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  protected readonly HEART_RATE_SERVICE = numberToUUID(0x180d);

  public readonly scanResultUpdated = new EventEmitter<ScanResult>();


  async scan(): Promise<void> {
    try {
      await BleClient.initialize();

      await BleClient.requestLEScan(
        {
          services: [this.HEART_RATE_SERVICE],
        },
        (result) => {
          console.log('received new scan result', result);
          this.scanResultUpdated.emit(result);
        },
      );

      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('stopped scanning');
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  }


}
