import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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

enum FormGroupKeys {
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
  templateUrl: './crate-or-update-characteristic-dialog.component.html',
  styleUrls: ['./crate-or-update-characteristic-dialog.component.scss'],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CrateOrUpdateCharacteristicDialogComponent implements OnInit {
  //injections
  readonly dialogRef = inject(MatDialogRef<CharacteristicInfosDialogComponent>);
  readonly characteristic = inject<BluetoothCharacteristic>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  //consts
  protected readonly FGK = FormGroupKeys;
  protected readonly bluetoothActions = Object.values(BluetoothAction);
  protected readonly bluetoothDataTypes = Object.values(BluetoothDataType);
  protected readonly deleteIcon = faTrash;

  //form
  protected characteristicForm!: FormGroup;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.createCharacteristicForm(this.characteristic);
  }

  createCharacteristicInfoForm(info?: BluetoothCharacteristicInfo): FormGroup {
    return this.fb.group({
      [this.FGK.Title]: [info?.title || '', Validators.required],
      [this.FGK.Description]: [info?.description || '', Validators.required],
      [this.FGK.ValueKey]: [info?.valueKey || ''],
    });
  }

  createCharacteristicForm(characteristic: BluetoothCharacteristic): void {
    this.characteristicForm = this.fb.group({
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

  protected saveCharacteristic() {
    if (this.characteristicForm.valid) {
      const characteristic: BluetoothCharacteristic = {
        ...this.characteristicForm.value,
        infos: this.infos.value as BluetoothCharacteristicInfo[],
      };

      console.log(characteristic);

      this.dialogRef.close(characteristic);
    }
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
