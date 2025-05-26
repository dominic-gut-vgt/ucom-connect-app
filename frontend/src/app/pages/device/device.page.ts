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
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';

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

  //flags
  protected isReading = signal<boolean>(false);
  protected isWriting = signal<boolean>(false);
  protected updatedValueInd = signal<number>(-1);

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
    this.scanResult.set(nav?.extras?.state?.[ROUTE_PARAM_IDS.scanResult]);

    if (this.scanResult()) {
      //read all characteristics on init
      for (let i = 0; i < this.ucomConnectCharacteristics.length; i++) {
        this.readCharacteristic(i);
      }
    }
  }



  //characteristics------------------------------------------------------------
  protected readCharacteristic(ind: number): void {
    if (!this.isReading()) {
      const characteristic = this.ucomConnectCharacteristics[ind];
      this.isReading.set(true);
      this.bluetoothService.readCharacteristic(this.scanResult()?.device.deviceId ?? '', characteristic.serviceUUID, characteristic.uuid, characteristic.dataType).subscribe({
        next: (value) => {
          this.ucomConnectCharacteristics[ind].value = value;
          this.updatedValueInd.set(ind);
          setTimeout(() => {
            this.updatedValueInd.set(-1);
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

  protected writeCharacteristic(ind: number): void {
    if (!this.isWriting()) {
      const characteristic = this.ucomConnectCharacteristics[ind];
      const value = this.characteristicValues.at(ind).value.value;
      this.isWriting.set(true);
      this.bluetoothService.writeCharacteristic(this.scanResult()?.device.deviceId ?? '', characteristic.serviceUUID, characteristic.uuid, value, characteristic.dataType).subscribe({
        next: (worked) => {
          console.log(worked);
          this.readCharacteristic(ind);
          this.isWriting.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isWriting.set(false);
        }
      });
    }
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
