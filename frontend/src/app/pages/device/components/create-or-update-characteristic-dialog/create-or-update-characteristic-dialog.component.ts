import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BluetoothCharacteristic, BluetoothCharacteristicInfo } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { CharacteristicInfosDialogComponent } from '../characteristic-infos-dialog/characteristic-infos-dialog.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LocalStorageKey } from 'src/app/shared/enums/local-storage-key.enum';
import { v4 as uuid } from 'uuid';
import { CharacteristicsService } from 'src/app/services/characteristics.service';

enum FormGroupKeys {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  UUID = 'uuid',
  ServiceUUID = 'serviceUUID',
  DeviceId = 'deviceId',
  DataType = 'dataType',
  BluetoothAction = 'bluetoothAction',
  Value = 'value',
  ReadAfterEveryWrite = 'readAfterEveryWrite',
  Infos = 'infos',
  ValueKey = 'valueKey',
}


@Component({
  selector: 'app-crate-or-update-characteristic-dialog',
  templateUrl: './create-or-update-characteristic-dialog.component.html',
  styleUrls: ['./create-or-update-characteristic-dialog.component.scss'],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CreateOrUpdateCharacteristicDialogComponent implements OnInit {
  //injections
  private dialogRef = inject(MatDialogRef<CharacteristicInfosDialogComponent>);
  private characteristic = inject<BluetoothCharacteristic>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);
  private characteristicsService = inject(CharacteristicsService);

  //consts
  protected readonly FGK = FormGroupKeys;
  protected readonly bluetoothActions = Object.values(BluetoothAction);
  protected readonly bluetoothDataTypes = Object.values(BluetoothDataType);
  protected readonly deleteIcon = faTrash;

  //data
  private characteristics: BluetoothCharacteristic[] = [];

  //form
  protected characteristicForm!: FormGroup;

  //flags
  protected deletePossible = signal(false);

  ngOnInit() {
    this.createCharacteristicForm(this.characteristic);
    this.localStorageService.getItem<BluetoothCharacteristic[]>(LocalStorageKey.Characteristics).then((characteristics) => {
      if (characteristics) {
        this.characteristics = characteristics;
      }
    })
  }

  protected saveCharacteristic() {
    if (this.characteristicForm.valid) {
      const characteristic = this.getCharacteristicFromForm();
      this.deletePossible.set(false);

      this.characteristicsService.saveCharacteristic(characteristic).then(() => {
        this.dialogRef.close(characteristic);
      });
    }
  }


  protected deleteCharacteristic(): void {

    if (this.deletePossible()) {
      const characteristic = this.getCharacteristicFromForm();
      this.characteristicsService.deleteCharacteristic(characteristic).then(() => {
        this.deletePossible.set(false);
        this.dialogRef.close(characteristic);
      });
    } else {
      this.deletePossible.set(true);
    }
  }

  protected clearReallyDelete(): void {
    this.deletePossible.set(false);
  }


  //formgroup---------------------------------------------------------------


  private createCharacteristicInfoForm(info?: BluetoothCharacteristicInfo): FormGroup {
    return this.fb.group({
      [this.FGK.Title]: [info?.title || '', Validators.required],
      [this.FGK.Description]: [info?.description || '', Validators.required],
      [this.FGK.ValueKey]: [info?.valueKey || ''],
    });
  }

  private createCharacteristicForm(characteristic: BluetoothCharacteristic): void {
    this.characteristicForm = this.fb.group({
      [this.FGK.Id]: [characteristic?.id || uuid(), Validators.required],
      [this.FGK.Title]: [characteristic?.title || '', Validators.required],
      [this.FGK.Description]: [characteristic?.description || '', Validators.required],
      [this.FGK.UUID]: [characteristic?.uuid || '', Validators.required],
      [this.FGK.ServiceUUID]: [characteristic?.serviceUUID || '', Validators.required],
      [this.FGK.DeviceId]: [characteristic?.deviceId || ''],
      [this.FGK.DataType]: [characteristic?.dataType || '', Validators.required],
      [this.FGK.BluetoothAction]: [characteristic?.bluetoothAction || '', Validators.required],
      [this.FGK.Value]: [characteristic?.value || ''],
      [this.FGK.ReadAfterEveryWrite]: [characteristic?.readAfterEveryWrite ?? false],
      [this.FGK.Infos]: this.fb.array(
        (characteristic?.infos || []).map(info => this.createCharacteristicInfoForm(info))
      ),
    });
  }

  private getCharacteristicFromForm(): BluetoothCharacteristic {
    return {
      ...this.characteristicForm.value,
      [this.FGK.Infos]: this.infos.value as BluetoothCharacteristicInfo[],
    } as BluetoothCharacteristic;
  }


  protected get infos(): FormArray {
    return this.characteristicForm.get(this.FGK.Infos) as FormArray;
  }

  protected addInfo() {
    this.infos.push(this.createCharacteristicInfoForm());
  }

  protected removeInfo(index: number) {
    this.infos.removeAt(index);
  }

}
