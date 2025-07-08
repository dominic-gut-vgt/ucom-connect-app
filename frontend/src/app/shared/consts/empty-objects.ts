import { BluetoothAction } from "../enums/bluetooth-action.enum";
import { BluetoothDataType } from "../enums/bluetooth-data-type.enum";
import { BluetoothCharacteristic } from "../interfaces/bluetooth-characteristic.interface";
import { Template, TemplateData } from "../interfaces/templates/template.interface";

class EmptyObjects {
  getEmptyTemplateData(): TemplateData {
    return JSON.parse(JSON.stringify(UCOM_CONNECT_TEMPLATE_DATA));
  }
  getEmptyUcomConnectTemplate(): Template {
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
  onlyPredefinedValuePossible: false,
  infos: [],
  readAfterEveryWrite: false,
  sendBtnText: ''
}


const UCOM_CONNECT_TEMPLATE_DATA: TemplateData = {
  characteristicId: '',
  writeValue: ''
};

const UCOM_CONNECT_TEMPLATE: Template = {
  id: '',
  name: '',
  description: '',
  data: []
};