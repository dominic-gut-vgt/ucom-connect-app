import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";
import { BluetoothCharacteristic } from "../interfaces/bluetooth-characteristic";

export const UCOM_CONNECT_CHARACTERISTICS: BluetoothCharacteristic[] = [
  {
    title: 'WifiSSID',
    description: 'Edit the wifi SDID',
    uuid: '3216f2a6-8522-4855-bf75-0ef063789ea0',
    serviceUUID:'0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String,
    bluetoothAction: BluetoothAction.ReadWrite,
    value: ''
  }
]