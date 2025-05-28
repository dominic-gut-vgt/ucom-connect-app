
export interface TemplateData {
  characteristicId: string,
  writeValue: string,
}
export interface Template {
  id: string;
  name: string;
  description?: string;
  data: TemplateData[];
}