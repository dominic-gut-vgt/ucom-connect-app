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
import { DeviceCharacteristicComponent } from './components/device-characteristic/device-characteristic.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule,DeviceCharacteristicComponent]
})
export class DevicePage implements OnInit {
  private router = inject(Router);

  //consts
  protected readonly ucomConnectCharacteristics: BluetoothCharacteristic[] = JSON.parse(JSON.stringify(UCOM_CONNECT_CHARACTERISTICS));
  protected readonly bluetoothAction = BluetoothAction;

  //data
  protected scanResult = signal<ScanResult | undefined>(undefined);


  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.scanResult.set(nav?.extras?.state?.[ROUTE_PARAM_IDS.scanResult]);
  }


}
