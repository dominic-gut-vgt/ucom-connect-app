export interface Template<T> {
  id: string;
  name: string;
  description?: string;
  data: T;
}