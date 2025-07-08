import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";
import { UcomConnectcharacteristicTitle } from "../enums/ucom-connect-characteristic-title.enum";
import { BluetoothCharacteristic, BluetoothCharacteristicInfo } from "../interfaces/bluetooth-characteristic.interface";


//characteristic infos-------------------------------------------------------------------

const CONSOLE_CHARACTERISTIC_INFOS: BluetoothCharacteristicInfo[] = [
  {
    title: 'Status S1',
    description: 'The device is started and is waiting for an Internet connection',
    valueKey: 'S1',
  },
  {
    title: 'Status S2',
    description: 'The Wifi SSID or the Wifi password could not be parsed',
    valueKey: 'S2',
  },
  {
    title: 'Status S3',
    description: 'No Wifi SSID or Wifi password is configured',
    valueKey: 'S3',
  },
  {
    title: 'Status S4',
    description: 'The Wifi connection was interrupted',
    valueKey: 'S4',
  },
  {
    title: 'Status S5',
    description: 'The device has been assigned an IP',
    valueKey: 'S5',
  },
  {
    title: 'Status S6',
    description: 'The cloud URIs could not be parsed',
    valueKey: 'S6',
  },
  {
    title: 'Status S7',
    description: 'No cloud URIs are configured',
    valueKey: 'S7',
  },
  {
    title: 'Status S8',
    description: 'The DeviceID could not be parsed',
    valueKey: 'S8',
  },
  {
    title: 'Status S9',
    description: 'No DeviceID is configured',
    valueKey: 'S9',
  },
  {
    title: 'Status S10',
    description: 'An attempt is made to establish a connection to the cloud',
    valueKey: 'S10',
  },
  {
    title: 'Status S11',
    description: 'The device is connected to the cloud',
    valueKey: 'S11',
  },
  {
    title: 'Status S12',
    description: 'A reconnect has been initiated',
    valueKey: 'S12',
  },
];


//characteristics-----------------------------------------------------------------------


export const UCOM_CONNECT_CHARACTERISTICS: BluetoothCharacteristic[] = [
  {
    id: UcomConnectcharacteristicTitle.Status,
    title: UcomConnectcharacteristicTitle.Status,
    description: 'displays status messages as long as the device is trying to connect to the cloud',
    uuid: '1daf6670-8417-11ec-a8a3-0242ac120002',
    serviceUUID: '1daf6670-8417-11ec-a8a3-0242ac120002',
    dataType: BluetoothDataType.String64,
    bluetoothAction: BluetoothAction.Read,
    value: true,
    onlyPredefinedValuePossible: false,
    infos: CONSOLE_CHARACTERISTIC_INFOS,
    readAfterEveryWrite: true,
    sendBtnText: 'Read Status',
  },
  {
    id: UcomConnectcharacteristicTitle.DeviceId,
    title: UcomConnectcharacteristicTitle.DeviceId,
    description: 'Edit the Device ID',
    uuid: '670b5b89-e5f0-464c-8d0f-2fd91d15f676',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String32,
    bluetoothAction: BluetoothAction.ReadWrite,
    value: 'UCOM-Connect-Device',
    onlyPredefinedValuePossible: false,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Write Device ID',
  },
  {
    id: UcomConnectcharacteristicTitle.CloudURI,
    title: UcomConnectcharacteristicTitle.CloudURI,
    description: 'Edit the wifi cloud URI',
    uuid: '7a311524-82cd-11ec-a8a3-0242ac120002',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String128,
    bluetoothAction: BluetoothAction.ReadWrite,
    value: '',
    onlyPredefinedValuePossible: false,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Write Cloud URI',
  },
  {
    id: UcomConnectcharacteristicTitle.WifiSSID,
    title: UcomConnectcharacteristicTitle.WifiSSID,
    description: 'Edit the wifi SSID',
    uuid: '3216f2a6-8522-4855-bf75-0ef063789ea0',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String32,
    bluetoothAction: BluetoothAction.ReadWrite,
    value: '',
    onlyPredefinedValuePossible: false,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Write Wifi SSID',
  },
  {
    id: UcomConnectcharacteristicTitle.Restart,
    title: UcomConnectcharacteristicTitle.Restart,
    description: 'Restart the device', //sends a true to the device to trigger a restart
    uuid: 'b00f25e0-9255-11ec-b909-0242ac120002',
    serviceUUID: 'daa6dc5e-9254-11ec-b909-0242ac120002',
    dataType: BluetoothDataType.Boolean,
    bluetoothAction: BluetoothAction.Write,
    value: true,
    onlyPredefinedValuePossible: true,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Restart Device',
  },
  {
    id: UcomConnectcharacteristicTitle.Reconnect,
    title: UcomConnectcharacteristicTitle.Reconnect,
    description: 'Deconnect from cloud, read settings and reconnect', //sends a true to the device to trigger a reconnect
    uuid: '3ed9996c-f210-11ec-b939-0242ac120002',
    serviceUUID: 'daa6dc5e-9254-11ec-b909-0242ac120002',
    dataType: BluetoothDataType.Boolean,
    bluetoothAction: BluetoothAction.Write,
    value: true,
    onlyPredefinedValuePossible: true,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Reconnect Device',
  },
  {
    id: UcomConnectcharacteristicTitle.WifiPassword,
    title: UcomConnectcharacteristicTitle.WifiPassword,
    description: 'Edit the wifi password',
    uuid: 'c2810373-9fce-43dc-a142-2bd533ff5d64',
    serviceUUID: '0be217e9-d3a5-428f-a009-31fa6831b9c5',
    dataType: BluetoothDataType.String64,
    bluetoothAction: BluetoothAction.Write,
    value: '',
    onlyPredefinedValuePossible: false,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Write Wifi Password',
  },
  {
    id: UcomConnectcharacteristicTitle.Autorestart,
    title: UcomConnectcharacteristicTitle.Autorestart,
    description: 'Specifies whether the device is restarted after a successful update to complete the update',
    uuid: '285967ac-924e-11ec-b909-0242ac120002',
    serviceUUID: '7f0de21c-838f-11ec-a8a3-0242ac120002',
    dataType: BluetoothDataType.Boolean,
    bluetoothAction: BluetoothAction.Read,
    value: true,
    onlyPredefinedValuePossible: false,
    infos: [],
    readAfterEveryWrite: false,
    sendBtnText: 'Read Autorestart',
  }
];
