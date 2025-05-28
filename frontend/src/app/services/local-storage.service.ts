import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { LocalStorageKey } from '../shared/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly APP_KEY = 'vgt-ucom-connect';

  constructor() { }

  public async setItem<T>(key: string, value: T) {
    await Preferences.set({
      key: `${this.APP_KEY}-${key}`,
      value: JSON.stringify(value)
    });
  }

  public async getItem<T>(key: LocalStorageKey): Promise<T | undefined> {
    const ret = await Preferences.get({ key: `${this.APP_KEY}-${key}` });
    if (ret.value !== null) {
      return JSON.parse(ret.value) as T;
    }
    return undefined;
  }

  public async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key: key });
  };

}
