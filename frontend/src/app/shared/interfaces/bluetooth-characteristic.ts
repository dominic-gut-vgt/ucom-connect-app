import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";

export interface BluetoothCharacteristicInfo {
  title: string,
  description: string,
}
export interface BluetoothCharacteristic {
  title: string,
  description: string,
  uuid: string,
  serviceUUID: string,
  dataType: BluetoothDataType,
  bluetoothAction: BluetoothAction,
  value: any,
  infos: BluetoothCharacteristicInfo[];
}