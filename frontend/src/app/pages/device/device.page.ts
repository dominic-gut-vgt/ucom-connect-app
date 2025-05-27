import { Component, inject, OnInit, signal, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PARAM_IDS } from 'src/app/shared/consts/routes';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DeviceCharacteristicComponent } from './components/device-characteristic/device-characteristic.component';
import { MatDialog } from '@angular/material/dialog';
import { CrateOrUpdateCharacteristicDialogComponent } from './components/crate-or-update-characteristic-dialog/crate-or-update-characteristic-dialog.component';
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, DeviceCharacteristicComponent,MatButtonModule]
})
export class DevicePage implements OnInit {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);

  //consts
  protected readonly ucomConnectCharacteristics: BluetoothCharacteristic[] = JSON.parse(JSON.stringify(UCOM_CONNECT_CHARACTERISTICS));
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly addIcon = faPlus;

  //viewchildren
  private readonly characteristicItems = viewChildren(DeviceCharacteristicComponent);

  //data
  protected scanResult = signal<ScanResult | undefined>(undefined);


  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.scanResult.set(nav?.extras?.state?.[ROUTE_PARAM_IDS.scanResult]);
  }

  onCharacteristicWritten(): void {
    this.characteristicItems().forEach(item => {
      if (item.characteristic().readAfterEveryWrite) {
        item.readCharacteristic();
      }
    });
  }

    //dialog -------------------------------------------------------------------
    openCreateCharacteristicDialog(): void {
      let emptyCharacteristic=EMPTY_OBJECTS.getEmptyBluetoothCharacteristic();
      emptyCharacteristic.deviceId = this.scanResult()?.device.deviceId;
      this.dialog.open(CrateOrUpdateCharacteristicDialogComponent, {
        data: emptyCharacteristic,
      });
    }

}
