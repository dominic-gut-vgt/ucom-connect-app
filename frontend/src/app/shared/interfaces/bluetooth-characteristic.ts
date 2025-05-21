import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";

export interface BluetoothCharacteristic {
  title: string,
  description: string,
  uuid: string,
  serviceUUID: string,
  dataType: BluetoothDataType,
  bufferLength: number, //in bytes
  bluetoothAction: BluetoothAction,
  value: any
}