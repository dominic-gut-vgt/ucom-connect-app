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
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { MatButtonModule } from '@angular/material/button';
import { CreateOrUpdateCharacteristicDialogComponent } from './components/create-or-update-characteristic-dialog/create-or-update-characteristic-dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LocalStorageKey } from 'src/app/shared/enums/local-storage-key.enum';
import { CharacteristicsService } from 'src/app/services/characteristics.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, DeviceCharacteristicComponent, MatButtonModule]
})
export class DevicePage implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private characteristicsService = inject(CharacteristicsService);

  //consts
  protected readonly ucomConnectCharacteristics: BluetoothCharacteristic[] = JSON.parse(JSON.stringify(UCOM_CONNECT_CHARACTERISTICS));
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly addIcon = faPlus;

  //viewchildren
  private readonly characteristicItems = viewChildren(DeviceCharacteristicComponent);

  //data
  protected scanResult = signal<ScanResult | undefined>(undefined);
  protected selfCreatedCharacteristics = this.characteristicsService.selfCreatedCharacteristicsReadonly;

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
  openCreateOrUpdateCharacteristicDialog(characteristic: BluetoothCharacteristic | undefined = undefined): void {
    if (!characteristic) {
      characteristic = EMPTY_OBJECTS.getEmptyBluetoothCharacteristic();
      characteristic.deviceId = this.scanResult()?.device.deviceId;
    }
    const dialogRef = this.dialog.open(CreateOrUpdateCharacteristicDialogComponent, {
      data: characteristic,
    });
  }

  openEditCharacteristicDialog(characteristic: BluetoothCharacteristic): void {
    this.openCreateOrUpdateCharacteristicDialog(characteristic);
  }

}
