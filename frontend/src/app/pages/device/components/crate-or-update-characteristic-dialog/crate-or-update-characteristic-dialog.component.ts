import { Component, inject, OnInit } from '@angular/core';
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
  StringValue = 'stringValue',
  BooleanValue = 'booleanValue',
  NumberValue = 'numberValue',
}


@Component({
  selector: 'app-crate-or-update-characteristic-dialog',
  templateUrl: './crate-or-update-characteristic-dialog.component.html',
  styleUrls: ['./crate-or-update-characteristic-dialog.component.scss'],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatButtonModule]
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

  constructor() { }

  ngOnInit() {

    this.createCharacteristicForm(this.characteristic);
  }

  createCharacteristicInfoForm(info?: BluetoothCharacteristicInfo): FormGroup {
    return this.fb.group({
      title: [info?.title || '', Validators.required],
      description: [info?.description || '', Validators.required],
      valueKey: [info?.valueKey || ''],
    });
  }

  createCharacteristicForm(characteristic: BluetoothCharacteristic): void {
    this.characteristicForm = this.fb.group({
      title: [characteristic?.title || '', Validators.required],
      description: [characteristic?.description || '', Validators.required],
      uuid: [characteristic?.uuid || '', Validators.required],
      serviceUUID: [characteristic?.serviceUUID || '', Validators.required],
      deviceId: [characteristic?.deviceId || ''],
      dataType: [characteristic?.dataType || '', Validators.required],
      bluetoothAction: [characteristic?.bluetoothAction || '', Validators.required],
      value: [characteristic?.value || ''],
      readAfterEveryWrite: [characteristic?.readAfterEveryWrite ?? false],
      infos: this.fb.array(
        (characteristic?.infos || []).map(info => this.createCharacteristicInfoForm(info))
      ),
    });
  }

  // Getter for infos as FormArray
  get infos(): FormArray {
    return this.characteristicForm.get('infos') as FormArray;
  }

  addInfo() {
    this.infos.push(this.createCharacteristicInfoForm());
  }

  removeInfo(index: number) {
    this.infos.removeAt(index);
  }

}
