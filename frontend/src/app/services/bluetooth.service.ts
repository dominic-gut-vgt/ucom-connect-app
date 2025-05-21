import { EventEmitter, Injectable } from '@angular/core';
import { BleClient, numberToUUID, ScanResult, numbersToDataView, ScanMode } from '@capacitor-community/bluetooth-le';
import { BluetootAction } from '../shared/enums/bluetooth-action.enum';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  protected readonly SERVICES = [
    // '3216f2a6-8522-4855-bf75-0ef063789ea0',
    numberToUUID(0x180a),
    // 'daa6dc5e-9254-11ec-b909-0242ac120002',
    // '0be217e9-d3a5-428f-a009-31fa6831b9c5'
  ]

  public readonly scanResultUpdated = new EventEmitter<ScanResult>();
  public readonly isScanningUpdated = new EventEmitter<boolean>();

  //flags
  private isScanning = false;

  public async doActionOnServiceCharacteristic(deviceId: string, service: string, characteristic: string, action: BluetootAction): Promise<void> {
    try {
      await BleClient.initialize();

      // connect to device, the onDisconnect callback is optional
      await BleClient.connect(deviceId, (deviceId) => this.onDisconnect(deviceId));

      if (action === BluetootAction.Read || action === BluetootAction.ReadWrite) {
        const battery = await BleClient.read(deviceId, service, characteristic);
        console.log('+++++++battery level', battery.getUint8(0));
      }

      if (action === BluetootAction.Write || action === BluetootAction.ReadWrite) {
        await BleClient.write(deviceId, service, characteristic, numbersToDataView([1, 0]));
        console.log('+++++++written [1, 0] to control point');
      }

      await BleClient.startNotifications(
        deviceId,
        service,
        characteristic,
        (value) => {
          console.log('++++++++current heart rate', this.parseHeartRate(value));
        },
      );

      // disconnect after 10 sec
      setTimeout(async () => {
        await BleClient.stopNotifications(deviceId, service, characteristic);
        await BleClient.disconnect(deviceId);
        console.log('disconnected from device', deviceId);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  }

  private onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`);
  }

  private parseHeartRate(value: DataView): number {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits > 0) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  }


  async scan(): Promise<void> {
    this.setIsScanning(true);
    try {
      await BleClient.initialize();

      console.log("++++++++start scanning");
      await BleClient.requestLEScan(
        {
          services: this.SERVICES,
        },
        result => {
          this.scanResultUpdated.emit(result);
          console.log('+++++++received new scan result', result);
        },
      );

      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('+++++++++stopped scanning');
        this.setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.error(error);
      this.setIsScanning(false);
    }
  }


  private setIsScanning(state: boolean): void {
    this.isScanning = state;
    this.isScanningUpdated.emit(state);

  }

}
