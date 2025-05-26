import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";
import { BluetoothCharacteristic } from "../interfaces/bluetooth-characteristic";

export const UCOM_CONNECT_CHARACTERISTICS: BluetoothCharacteristic[] = [
  {
    title: 'Restart',
    description: 'Send a TRUE to restart the device',
    uuid: 'b00f25e0-9255-11ec-b909-0242ac120002',
    serviceUUID: 'daa6dc5e-9254-11ec-b909-0242ac120002',
    dataType: BluetoothDataType.Boolean,
    bluetoothAction: BluetoothAction.Write,
    value: true
  },
  {
    title: 'Reconnect',
    description: 'Send a TRUE to deconnect from cloud, read settings and reconnect',
    uuid: '3ed9996c-f210-11ec-b939-0242ac120002',
    serviceUUID: 'daa6dc5e-9254-11ec-b909-0242ac120002',
    dataType: BluetoothDataType.Boolean,
    bluetoothAction: BluetoothAction.Write,
    value: true
  },
  {
    title: 'WifiSSID',
    description: 'Edit the wifi SDID',
    uuid: '3216f2a6-8522-4855-bf75-0ef063789ea0',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String,
    bluetoothAction: BluetoothAction.ReadWrite,
    value: ''
  },
  {
    title: 'Wifi Password',
    description: 'Edit the wifi password',
    uuid: 'c2810373-9fce-43dc-a142-2bd533ff5d64',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String,
    bluetoothAction: BluetoothAction.Write,
    value: ''
  },
  {
    title: 'Cloud URI',
    description: 'Edit the wifi password',
    uuid: '670b5b89-e5f0-464c-8d0f-2fd91d15f676',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String,
    bluetoothAction: BluetoothAction.ReadWrite,
    value: ''
  },
  {
    title: 'Autorestart',
    description: 'Specifies whether the device is restarted after a successful update to complete the update',
    uuid: '285967ac-924e-11ec-b909-0242ac120002',
    serviceUUID: '7f0de21c-838f-11ec-a8a3-0242ac120002',
    dataType: BluetoothDataType.Boolean,
    bluetoothAction: BluetoothAction.Read,
    value: true
  },
]