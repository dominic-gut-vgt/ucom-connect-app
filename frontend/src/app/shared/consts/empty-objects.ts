import { Template } from "../interfaces/templates/template.interface";
import { UcomConnectSetupTemplateData } from "../interfaces/templates/ucom-connect-template-data.interface";


class EmptyObjects {
  getEmptyUcomConnectTemplateData(): UcomConnectSetupTemplateData {
    return JSON.parse(JSON.stringify(UCOM_CONNECT_TEMPLATE_DATA));
  }
  getEmptyUcomConnectTemplate(): Template<UcomConnectSetupTemplateData> {
    return JSON.parse(JSON.stringify(UCOM_CONNECT_TEMPLATE));
  }
}

export const EMPTY_OBJECTS = new EmptyObjects();




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