import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { faInfoCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { BluetoothDeviceListComponent } from './components/bluetooth-device-list/bluetooth-device-list.component';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { Capacitor } from '@capacitor/core';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, BluetoothDeviceListComponent,MatButtonModule]
})
export class HomePage {

  //injections
  private readonly bluetoothService = inject(BluetoothService);

  //consts
  protected readonly scanIcon = faSearch;
  protected readonly infoIcon = faInfoCircle

  //data
  protected scanResults = signal<ScanResult[]>([
    /*
    {
      device: {
        deviceId: 'device-id',
        name: 'UCOM-CONNECT-73'
      }
    }
    */
  ]);

  //flags
  private scannedOnce = false;
  protected isScanning = signal(false)
  protected bluetoothEnabled = signal(false);


  constructor() {
    this.bluetoothService.isScanningUpdated.subscribe((isScanning) => {
      this.isScanning.set(isScanning);
    });
    this.bluetoothService.scanResultUpdated.subscribe((scanResult) => {
      if (!this.scanResults().find(res => res.device.deviceId === scanResult.device.deviceId)) {
        this.scanResults.update((state) => {
          let updatedScanResults = [...state];
          updatedScanResults.push(scanResult);
          return updatedScanResults;
        });
      }
    });
    this.bluetoothService.bluetoothEnabledUpdated.subscribe((enabled) => {
      this.bluetoothEnabled.set(enabled);
      if (enabled) {
        if (!this.scannedOnce) {
          this.scanForDevices();
        }
      }
    });
  }

  protected scanForDevices(): void {
    this.scannedOnce = true;
    this.isScanning.set(true);
    this.bluetoothService.scan();
  }

}
