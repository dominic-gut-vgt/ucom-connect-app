import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { APP_DATA } from 'src/app/shared/consts/app-data';
import { PAGES } from 'src/app/shared/consts/routes';
import { IsUcomConnectDevicePipe } from '../../pipes/is-ucom-connect-device.pipe';

@Component({
  selector: 'app-bluetooth-device-list',
  templateUrl: './bluetooth-device-list.component.html',
  styleUrls: ['./bluetooth-device-list.component.scss'],
  imports: [CommonModule, FontAwesomeModule, IsUcomConnectDevicePipe]
})
export class BluetoothDeviceListComponent {
  //injections
  private router = inject(Router);

  //inputs
  scanResults = input.required<ScanResult[]>();

  //derived data
  filteredScanResults = computed(() => {
    if (this.showAllDevices()) {
      return this.scanResults();
    } else {
      return this.scanResults().filter(res => res.device.name?.includes(APP_DATA.ucomConnectBaseName))
    }
  });

  //consts
  protected readonly actionIcon = faRocket;

  //flags
  protected showAllDevices = signal(false);

  protected goToDevice(scanResult: ScanResult, isUcomConnectDevice: boolean): void {
    if (isUcomConnectDevice) {
      this.router.navigate(
        [PAGES.device.route],
        { state: { scanResult } } //has to be named scanResult
      );
    }
  }

  protected toggleShowAllDevices(): void {
    this.showAllDevices.update(showAll => !showAll);
  }

}
