import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChain, faRocket } from '@fortawesome/free-solid-svg-icons';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { PAGES } from 'src/app/shared/consts/routes';
import { BluetootAction } from 'src/app/shared/enums/bluetooth-action.enum';

@Component({
  selector: 'app-bluetooth-device-list',
  templateUrl: './bluetooth-device-list.component.html',
  styleUrls: ['./bluetooth-device-list.component.scss'],
  imports: [CommonModule, FontAwesomeModule]
})
export class BluetoothDeviceListComponent {
  //injections
  private readonly bluetoothService = inject(BluetoothService);
  private router = inject(Router);

  //inputs
  scanResults = input.required<ScanResult[]>();

  //consts
  protected readonly actionIcon = faRocket;

  protected goToDevice(deviceId: string): void {
    this.router.navigate([PAGES.device,deviceId]);
  }

  private doActionOnDevice(deviceId: string, serviceUUID: string, characteristicUUID: string): void {

    //this.bluetoothService.doActionOnServiceCharacteristic(deviceId, '0be217e9-d3a5-428f-a009-31fa6831b9c5', '3216f2a6-8522-4855-bf75-0ef063789ea0', BluetootAction.Read);
  }

}
