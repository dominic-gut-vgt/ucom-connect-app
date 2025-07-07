import { computed, inject, Injectable, signal } from '@angular/core';
import { UCOM_CONNECT_CHARACTERISTICS } from '../shared/consts/ucom-connect-characteristics';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKey } from '../shared/enums/local-storage-key.enum';
import { BluetoothCharacteristic } from '../shared/interfaces/bluetooth-characteristic.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacteristicsService {
  //injections
  private localStorageService = inject(LocalStorageService);

  //data
  private predefinedBluetoothCharacteristics = signal(UCOM_CONNECT_CHARACTERISTICS);
  private selfCreatedCharacteristics = signal<BluetoothCharacteristic[]>([]);
  public selfCreatedCharacteristicsReadonly = this.selfCreatedCharacteristics.asReadonly()

  //events
  public allCharacteristics = computed(() => {
    return this.predefinedBluetoothCharacteristics().concat(this.selfCreatedCharacteristics());
  })

  constructor() {
    this.loadSelfCreatedCharacteristics();
  }

  private loadSelfCreatedCharacteristics(): void {
    this.localStorageService.getItem<BluetoothCharacteristic[]>(LocalStorageKey.Characteristics).then((characteristics) => {
      if (characteristics) {
        this.selfCreatedCharacteristics.set(characteristics);
      }
    });
  }


  public saveCharacteristic(characteristic: BluetoothCharacteristic): Promise<void> {
    if (!this.selfCreatedCharacteristics().find(c => c.id === characteristic.id)) {
      this.selfCreatedCharacteristics.update(state => {
        let updatedCharecteristics = [...state];
        updatedCharecteristics.push(characteristic);
        return updatedCharecteristics;
      });
    } else {
      this.selfCreatedCharacteristics.set(this.selfCreatedCharacteristics().map(c => c.id === characteristic.id ? characteristic : c));
    }

    return this.localStorageService.setItem(LocalStorageKey.Characteristics, this.selfCreatedCharacteristics())
  }

  public deleteCharacteristic(characteristic: BluetoothCharacteristic): Promise<void> {
    this.selfCreatedCharacteristics.set(this.selfCreatedCharacteristics().filter(c => c.id !== characteristic.id));

    return this.localStorageService.setItem(LocalStorageKey.Characteristics, this.selfCreatedCharacteristics())
  }
}

