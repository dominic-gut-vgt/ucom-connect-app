import { EventEmitter, Injectable } from '@angular/core';
import { BleClient, numberToUUID, ScanResult, hexStringToDataView } from '@capacitor-community/bluetooth-le';
import { BluetoothAction } from '../shared/enums/bluetooth-action.enum';
import { BluetoothDataType } from '../shared/enums/bluetooth-data-type.enum';
import { Observable } from 'rxjs';

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


  public readCharacteristic<T>(
    deviceId: string,
    service: string,
    characteristic: string,
    dataType: BluetoothDataType
  ): Observable<T> {
    return new Observable<T>(observer => {
      (async () => {
        try {
          console.log("++++++++++++", deviceId);
          await BleClient.initialize();

          console.log('+++++++connecting');
          await BleClient.connect(deviceId, (deviceId) => this.onDisconnect(deviceId));
          const dataView = await BleClient.read(deviceId, service, characteristic);

          let value: T = this.parseValue<T>(dataView, dataType);

          observer.next(value);
          observer.complete();
        } catch (error) {
          console.error(error);
          observer.error(error);
        }
      })();
    });
  }

  parseValue<T>(dataView: DataView, dataType: BluetoothDataType): T {
    switch (dataType) {
      case BluetoothDataType.String:
        const byteArray = new Uint8Array(dataView.buffer);
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(byteArray) as T;
      case BluetoothDataType.Number:
        return dataView.getUint32(0, true) as T; // true = little-endian
      case BluetoothDataType.Boolean:
        return (dataView.getUint8(0) !== 0) as T;
      default:
        throw new Error('Unsupported Bluetooth data type');
    }
  }

  public writeCharacteristic(deviceId: string, service: string, characteristic: string, value: string, bluetoothDatatype: BluetoothDataType): Observable<boolean> {
    return new Observable<boolean>(observer => {
      (async () => {
        try {
          await BleClient.initialize();

          // connect to device, the onDisconnect callback is optional
          await BleClient.connect(deviceId, (deviceId) => this.onDisconnect(deviceId));
          let valueAsDataView: DataView;
          switch (bluetoothDatatype) {
            case BluetoothDataType.String: valueAsDataView = hexStringToDataView(this.stringToHex(value)); break;
            default: valueAsDataView = hexStringToDataView(this.stringToHex(value))
          }

          await BleClient.write(deviceId, service, characteristic, valueAsDataView);
          observer.next(true);
          observer.complete();

        } catch (error) {
          console.error(error);
          observer.error(error);
        }
      });
    })
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

  private stringToHex(str: string): string {
    return Array.from(str)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }


  async scan(): Promise<void> {
    if (!this.isScanning) {
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
  }


  private setIsScanning(state: boolean): void {
    this.isScanning = state;
    this.isScanningUpdated.emit(state);

  }

}
