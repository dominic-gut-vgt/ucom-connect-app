import { EventEmitter, Injectable } from '@angular/core';
import { BleClient, numberToUUID, ScanResult, hexStringToDataView, } from '@capacitor-community/bluetooth-le';
import { BluetoothDataType } from '../shared/enums/bluetooth-data-type.enum';
import { Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { bluetoothWriteValue } from '../shared/types/bluetooth.type';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  protected readonly SERVICES = [
    numberToUUID(0x180a),
  ]

  public readonly scanResultUpdated = new EventEmitter<ScanResult>();
  public readonly isScanningUpdated = new EventEmitter<boolean>();
  public readonly bluetoothEnabledUpdated = new EventEmitter<boolean>();

  //flags
  private isScanning = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await BleClient.initialize();

    //initial check
    BleClient.isEnabled().then((enabled) => {
      this.bluetoothEnabledUpdated.emit(enabled && Capacitor.isNativePlatform());
    }).catch((error) => {
      this.bluetoothEnabledUpdated.emit(false);
    });

    //subscribe to enabled state changes
    BleClient.startEnabledNotifications((enabled) => {
      this.bluetoothEnabledUpdated.emit(enabled);
    });
  }


  public readCharacteristic<T>(
    deviceId: string,
    service: string,
    characteristic: string,
    dataType: BluetoothDataType
  ): Observable<T> {
    return new Observable<T>(observer => {
      (async () => {
        try {
          if (deviceId.length > 0 && service.length > 0 && characteristic.length > 0) {

            await BleClient.connect(deviceId, (deviceId) => { console.info('disconnected ', deviceId) });
            const dataView = await BleClient.read(deviceId, service, characteristic);

            let value: T = this.parseValue<T>(dataView, dataType);

            observer.next(value);
            observer.complete();
          } else {
            observer.error(new Error('Invalid deviceId, service or characteristic'));
          }
        } catch (error) {
          console.error(error);
          observer.error(error);
        }
      })();
    });
  }

  parseValue<T>(dataView: DataView, dataType: BluetoothDataType): T {
    switch (dataType) {
      case BluetoothDataType.String128:
      case BluetoothDataType.String64:
      case BluetoothDataType.String32:
        const byteArray = new Uint8Array(dataView.buffer);
        const decoder = new TextDecoder('utf-8');
        const rawString = decoder.decode(byteArray) as string;
        return rawString.replace(/\0/g, '') as T; // remove null characters

      case BluetoothDataType.Number:
        return dataView.getUint32(0, true) as T; // true = little-endian
      case BluetoothDataType.Boolean:
        return (dataView.getUint8(0) !== 0) as T;
      default:
        throw new Error('Unsupported Bluetooth data type');
    }
  }

  public writeCharacteristic(deviceId: string, service: string, characteristic: string, value: bluetoothWriteValue, bluetoothDatatype: BluetoothDataType): Observable<boolean> {
    return new Observable<boolean>(observer => {
      (async () => {
        try {
          await BleClient.connect(deviceId, (deviceId) => { console.info('disconnected ', deviceId) });

          let valueAsDataView: DataView;
          switch (bluetoothDatatype) {
            case BluetoothDataType.String128:
              valueAsDataView = this.stringToFixedLengthDataView(value as string, 128)//hexStringToDataView(this.stringToHex(value as string));
              break;
            case BluetoothDataType.String64:
              valueAsDataView = this.stringToFixedLengthDataView(value as string, 64)//hexStringToDataView(this.stringToHex(value as string));
              break;
            case BluetoothDataType.String32:
              valueAsDataView = this.stringToFixedLengthDataView(value as string, 32)//hexStringToDataView(this.stringToHex(value as string));
              break;

            case BluetoothDataType.Boolean:
              const boolBuffer = new ArrayBuffer(1);
              new DataView(boolBuffer).setUint8(0, value ? 1 : 0);
              valueAsDataView = new DataView(boolBuffer);
              break;

            case BluetoothDataType.Uint8:
              const uint8Buffer = new ArrayBuffer(1);
              new DataView(uint8Buffer).setUint8(0, value as number);
              valueAsDataView = new DataView(uint8Buffer);
              break;

            case BluetoothDataType.Int16:
              const int16Buffer = new ArrayBuffer(2);
              new DataView(int16Buffer).setInt16(0, value as number, true); // littleEndian = true
              valueAsDataView = new DataView(int16Buffer);
              break;

            default: valueAsDataView = hexStringToDataView(this.stringToHex(value as string))
          }

          await BleClient.write(deviceId, service, characteristic, valueAsDataView);
          observer.next(true);
          observer.complete();
        } catch (error) {
          console.error(error);
          observer.error(error);
        }
      })();
    })
  }

  private stringToFixedLengthDataView(str: string, length: number): DataView {
    const encoder = new TextEncoder();
    let bytes = encoder.encode(str);

    if (bytes.length > length) {
      // Truncate if too long
      bytes = bytes.slice(0, length);
    } else if (bytes.length < length) {
      // Pad with null bytes if too short
      const padded = new Uint8Array(length);
      padded.set(bytes);
      bytes = padded;
    }
    return new DataView(bytes.buffer);
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
        await BleClient.requestLEScan(
          {
            services: this.SERVICES,
          },
          result => {
            this.scanResultUpdated.emit(result);
          },
        );

        setTimeout(async () => {
          await BleClient.stopLEScan();
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
