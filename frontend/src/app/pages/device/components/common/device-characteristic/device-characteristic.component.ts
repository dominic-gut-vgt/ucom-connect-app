import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook, faInfoCircle, faPen } from '@fortawesome/free-solid-svg-icons';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CharacteristicInfosDialogComponent } from '../../device-pro-view/components/characteristic-infos-dialog/characteristic-infos-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { bluetoothWriteValue } from 'src/app/shared/types/bluetooth.type';
import { ValuetoToCharacteristicInfoPipe } from 'src/app/pages/device/pipes/value-to-charactristic-info.pipe';

enum FormGroupKeys {
  StringValue = 'stringValue',
  BooleanValue = 'booleanValue',
  NumberValue = 'numberValue',
}

@Component({
  selector: 'app-device-characteristic',
  templateUrl: './device-characteristic.component.html',
  styleUrls: ['./device-characteristic.component.scss'],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, MatSlideToggleModule, ValuetoToCharacteristicInfoPipe, MatButtonModule, MatInput, MatLabel, MatFormField, MatIconModule]
})
export class DeviceCharacteristicComponent {
  //injections
  private bluetoothService = inject(BluetoothService);
  private fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);

  //inputs
  characteristic = model.required<BluetoothCharacteristic>();
  deviceId = input.required<string | undefined>();
  isSelfCreated = input.required<boolean>();

  //outputs
  readEvent = output<void>();
  writtenEvent = output<void>();
  editCharacteristicEvent = output<void>();

  //consts
  protected readonly FGK = FormGroupKeys;
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly bluetoothDataType = BluetoothDataType;
  protected readonly readIcon = faBook;
  protected readonly infoIcon = faInfoCircle;
  protected readonly editIcon = faPen;

  //flags
  private initiallyLoaded = false;
  protected isReading = signal<boolean>(false);
  protected isWriting = signal<boolean>(false);
  protected updated = signal<boolean>(false);

  //derived flags
  protected characteristicIsWritable = computed(() => {
    return this.characteristic().bluetoothAction === BluetoothAction.ReadWrite || this.characteristic().bluetoothAction === BluetoothAction.Write
  });
  protected characteristicIsReadable = computed(() => {
    return this.characteristic().bluetoothAction === BluetoothAction.ReadWrite || this.characteristic().bluetoothAction === BluetoothAction.Read
  });

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
      [this.FGK.StringValue]: new FormControl(''),
      [this.FGK.BooleanValue]: new FormControl(true),
      [this.FGK.NumberValue]: new FormControl(0),
    });
  }

  //dialog -------------------------------------------------------------------
  openCharacteristicInfosDialog(): void {
    this.dialog.open(CharacteristicInfosDialogComponent, {
      data: this.characteristic().infos,
    });
  }

  //read & write ------------------------------------------------------------
  public readCharacteristic(): void {
    if (!this.isReading() && this.characteristicIsReadable()) {
      this.isReading.set(true);
      this.bluetoothService.readCharacteristic(this.deviceId() ?? '', this.characteristic().serviceUUID, this.characteristic().uuid, this.characteristic().dataType).subscribe({
        next: (value) => {
          this.characteristic.update(state => {
            const updatedCharacteristic: BluetoothCharacteristic = { ...state };
            updatedCharacteristic.value = value;
            return updatedCharacteristic;
          });

          //update form value
          switch (this.characteristic().dataType) {
            case BluetoothDataType.Boolean:
              this.characteristicValueForm.get(this.FGK.BooleanValue)?.setValue(value as boolean);
              break;
            case BluetoothDataType.String:
              this.characteristicValueForm.get(this.FGK.StringValue)?.setValue(value as string);
              break;
            case BluetoothDataType.Number:
              this.characteristicValueForm.get(this.FGK.NumberValue)?.setValue(value as number);
              break;
            default:
              console.warn('Unsupported data type for characteristic value update');
          }
          this.readEvent.emit();
          this.updated.set(true);
          setTimeout(() => {
            this.updated.set(false);
          }, 3000);
          this.isReading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.isReading.set(false);
        }
      });
    }
  }

  public writeCharacteristic(): void {
    if (!this.isWriting() && this.characteristicIsWritable()) {
      const value = this.getWriteValue();
      this.isWriting.set(true);
      this.bluetoothService.writeCharacteristic(this.deviceId() ?? '', this.characteristic().serviceUUID, this.characteristic().uuid, value, this.characteristic().dataType).subscribe({
        next: () => {
          this.readCharacteristic();
          this.isWriting.set(false);
          this.writtenEvent.emit();
        },
        error: (error) => {
          console.error(error);
          this.isWriting.set(false);
        }
      });
    }
  }

  protected editCharacteristic(): void {
    this.editCharacteristicEvent.emit();
  }

  public getWriteValue(): bluetoothWriteValue {
    switch (this.characteristic().dataType) {
      case BluetoothDataType.Boolean:
        return this.characteristicValueForm.get(this.FGK.BooleanValue)?.value;
      case BluetoothDataType.String:
        return this.characteristicValueForm.get(this.FGK.StringValue)?.value;
      case BluetoothDataType.Number:
      case BluetoothDataType.Uint8:
      case BluetoothDataType.Int16:
      case BluetoothDataType.Int32:
        return this.characteristicValueForm.get(this.FGK.NumberValue)?.value;
      default:
        return '';
    }
  }

  public setWriteValue(value: bluetoothWriteValue, dataType: BluetoothDataType) {
    switch (dataType) {
      case BluetoothDataType.Boolean: return this.characteristicValueForm.get(this.FGK.BooleanValue)?.setValue(value);
      case BluetoothDataType.String: return this.characteristicValueForm.get(this.FGK.StringValue)?.setValue(value);
      case BluetoothDataType.Number:
      case BluetoothDataType.Uint8:
      case BluetoothDataType.Int16:
      case BluetoothDataType.Int32: return this.characteristicValueForm.get(this.FGK.NumberValue)?.setValue(value);
      default: ''
    }
  }
}
