import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";

export interface BluetoothCharacteristicInfo {
  title: string,
  description: string,
  valueKey?: string,// to map a received value to a info object 
}
export interface BluetoothCharacteristic {
  id:string,
  title: string,
  description: string,
  uuid: string,
  serviceUUID: string,
  deviceId?: string,
  dataType: BluetoothDataType,
  bluetoothAction: BluetoothAction,
  value: any,
  infos: BluetoothCharacteristicInfo[];
  readAfterEveryWrite:boolean
}