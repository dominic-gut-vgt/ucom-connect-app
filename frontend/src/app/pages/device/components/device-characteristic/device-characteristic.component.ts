import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';

enum FormGroupKeys {
  Value = 'value',
}


@Component({
  selector: 'app-device-characteristic',
  templateUrl: './device-characteristic.component.html',
  styleUrls: ['./device-characteristic.component.scss'],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule]
})
export class DeviceCharacteristicComponent implements OnInit {
  //injections
  private bluetoothService = inject(BluetoothService);
  private fb = inject(FormBuilder);

  //inputs
  characteristic = model.required<BluetoothCharacteristic>();
  deviceId = input.required<string | undefined>();

  //consts
  protected readonly FGK = FormGroupKeys;
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly readIcon = faBook;
  protected readonly bluetoothDataType = BluetoothDataType;

  //flags
  private initiallyLoaded = false;
  protected isReading = signal<boolean>(false);
  protected isWriting = signal<boolean>(false);
  protected updated = signal<boolean>(false);

  //form
  protected characteristicValueForm!: FormGroup;

  constructor() {
    effect(() => {
      if (!this.initiallyLoaded) {
        if (this.characteristic().bluetoothAction === BluetoothAction.Read || this.characteristic().bluetoothAction === BluetoothAction.ReadWrite) {
          this.readCharacteristic();
        }
        this.initiallyLoaded = true;
      }
    });

    this.characteristicValueForm = this.fb.group({
      [this.FGK.Value]: new FormControl(''),
    });
  }

  ngOnInit() {

  }



  //characteristics------------------------------------------------------------
  protected readCharacteristic(): void {
    if (!this.isReading()) {
      this.isReading.set(true);
      this.bluetoothService.readCharacteristic(this.deviceId() ?? '', this.characteristic().serviceUUID, this.characteristic().uuid, this.characteristic().dataType).subscribe({
        next: (value) => {
          this.characteristic.update(state => {
            const updatedCharacteristic: BluetoothCharacteristic = { ...state };
            updatedCharacteristic.value = value;
            return updatedCharacteristic;
          });
          this.updated.set(true);
          setTimeout(() => {
            this.updated.set(false);
          }, 3000);
          this.isReading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isReading.set(false);
        }
      });
    }
  }

  protected writeCharacteristic(): void {
    if (!this.isWriting()) {
      const value = this.characteristicValueForm.get(this.FGK.Value)?.value;
      this.isWriting.set(true);
      this.bluetoothService.writeCharacteristic(this.deviceId() ?? '', this.characteristic().serviceUUID, this.characteristic().uuid, value, this.characteristic().dataType).subscribe({
        next: (worked) => {
          console.log(worked);
          this.readCharacteristic();
          this.isWriting.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isWriting.set(false);
        }
      });
    }
  }
}
