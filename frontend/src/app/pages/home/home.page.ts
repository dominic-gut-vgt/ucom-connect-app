import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { faGear, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BluetootAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { BleDevice, ScanResult } from '@capacitor-community/bluetooth-le';
import { BluetoothDeviceListComponent } from './components/bluetooth-device-list/bluetooth-device-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, BluetoothDeviceListComponent]
})
export class HomePage implements OnInit {

  //injections
  private readonly bluetoothService = inject(BluetoothService);

  //consts
  protected readonly scanIcon = faSearch;

  //data
  protected scanResults = signal<ScanResult[]>([]);

  //flags
  protected isScanning = signal(false)


  constructor() {
    this.bluetoothService.isScanningUpdated.subscribe((isScanning) => {
      this.isScanning.set(isScanning);
    });
    this.bluetoothService.scanResultUpdated.subscribe((scanResult) => {
      console.log("++++++", scanResult);
      if (!this.scanResults().find(res => res.device.deviceId === scanResult.device.deviceId)) {
        console.log("+++++++++ not in list");
        this.scanResults.update((state) => {
          let updatedScanResults = [...state];
          updatedScanResults.push(scanResult);
          return updatedScanResults;
        });
      }
    });
  }

  ngOnInit() {
  }

  protected scanForDevices(): void {
    this.isScanning.set(true);
    this.bluetoothService.scan();
  }

}
