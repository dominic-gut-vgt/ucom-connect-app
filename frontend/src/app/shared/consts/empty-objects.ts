import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";
import { BluetoothCharacteristic } from "../interfaces/bluetooth-characteristic";
import { Template } from "../interfaces/templates/template.interface";
import { UcomConnectSetupTemplateData } from "../interfaces/templates/ucom-connect-template-data.interface";
import {v4 as uuid} from 'uuid';

class EmptyObjects {
  getEmptyUcomConnectTemplateData(): UcomConnectSetupTemplateData {
    return JSON.parse(JSON.stringify(UCOM_CONNECT_TEMPLATE_DATA));
  }
  getEmptyUcomConnectTemplate(): Template<UcomConnectSetupTemplateData> {
    return JSON.parse(JSON.stringify(UCOM_CONNECT_TEMPLATE));
  }
  getEmptyBluetoothCharacteristic(): BluetoothCharacteristic {
    return JSON.parse(JSON.stringify(BLUETOOTH_CHARACTERISTIC));
  }
}

export const EMPTY_OBJECTS = new EmptyObjects();


const BLUETOOTH_CHARACTERISTIC: BluetoothCharacteristic = {
  id: '',
  title: '',
  description: '',
  uuid: '',
  serviceUUID: '',
  deviceId: '',
  dataType: BluetoothDataType.String,
  bluetoothAction: BluetoothAction.Read,
  value: '',
  infos: [],
  readAfterEveryWrite: false,
}


const UCOM_CONNECT_TEMPLATE_DATA: UcomConnectSetupTemplateData = {
  wifiSSID: '',
  wifiPassword: '',
  cloudURI: '',
  autorestart: false,
  restart: false,
  reconnect: false
};

const UCOM_CONNECT_TEMPLATE: Template<UcomConnectSetupTemplateData> = {
  id: '',
  name: '',
  description: '',
  data: EMPTY_OBJECTS.getEmptyUcomConnectTemplateData()
};