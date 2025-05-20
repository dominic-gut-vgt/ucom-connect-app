import { EventEmitter, Injectable } from '@angular/core';
import { BleClient, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  protected readonly HEART_RATE_SERVICE = numberToUUID(0x180d);

  public readonly scanResultUpdated = new EventEmitter<ScanResult>();
  public readonly isScanningUpdated = new EventEmitter<boolean>();

  //flags
  private isScanning = false;

  async scan(): Promise<void> {
    if (!this.isScanning) {
      this.isScanningUpdated.emit(true);
      this.isScanning = true;
      try {
        await BleClient.initialize();

        await BleClient.requestLEScan(
          {
            services: [this.HEART_RATE_SERVICE],
          },
          (result) => {
            this.scanResultUpdated.emit(result);
            this.isScanningUpdated.emit(false);
            this.isScanning = false;
          },
        );

        setTimeout(async () => {
          await BleClient.stopLEScan();
          console.log('++++++++stopped scanning');
          this.isScanningUpdated.emit(false);
          this.isScanning = false;
        }, 5000);
      } catch (error) {
        console.error("++++++++++++++"+error);
        this.isScanningUpdated.emit(false);
        this.isScanning = false;
      }
    }

  }


}
