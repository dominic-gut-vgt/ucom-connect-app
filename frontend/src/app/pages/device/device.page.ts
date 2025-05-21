import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PARAM_IDS } from 'src/app/shared/consts/routes';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { BluetoothService } from 'src/app/services/bluetooth.service';

enum FormGroupKeys {
  Values = 'values',
  Value = 'value',
}

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule]
})
export class DevicePage implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private bluetoothService = inject(BluetoothService);

  //consts
  protected readonly ucomConnectCharacteristics: BluetoothCharacteristic[] = JSON.parse(JSON.stringify(UCOM_CONNECT_CHARACTERISTICS));
  protected readonly FGK = FormGroupKeys;
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly readIcon = faBook;

  //data
  protected scanResult = signal<ScanResult | undefined>(undefined);

  //form
  protected characterisicValuesForm!: FormGroup;

  constructor() {
    this.characterisicValuesForm = this.fb.group({
      [this.FGK.Values]: this.fb.array([]) // initialize empty form array
    });

    for (const characteristic of this.ucomConnectCharacteristics) {
      this.addCharacteristicValue()
    }

    this.characterisicValuesForm.get(this.FGK.Values)?.valueChanges.subscribe((value) => {
      console.log(value);
    })
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.scanResult.set(nav?.extras?.state?.[ROUTE_PARAM_IDS.scanResult])
  }

  //characteristics------------------------------------------------------------
  protected readCharacteristic(ind: number): void {
    const characteristic = this.ucomConnectCharacteristics[ind];
    this.bluetoothService.readCharacteristic(this.scanResult()?.device.deviceId ?? '', characteristic.serviceUUID, characteristic.uuid);
  }

  protected writeCharacteristic(ind: number): void {
    const characteristic = this.ucomConnectCharacteristics[ind];
    const value = this.characteristicValues.at(ind).value;
    console.log(value);
    this.bluetoothService.writeCharacteristic(this.scanResult()?.device.deviceId ?? '', characteristic.serviceUUID, characteristic.uuid, value, characteristic.dataType);

  }

  //form-group-----------------------------------------------------------------

  get characteristicValues(): FormArray {
    return this.characterisicValuesForm.get(this.FGK.Values) as FormArray;
  }

  addCharacteristicValue(value = '') {
    const characteristicValues = this.fb.group({
      [this.FGK.Value]: [value]
    });

    this.characteristicValues.push(characteristicValues);
  }

}
