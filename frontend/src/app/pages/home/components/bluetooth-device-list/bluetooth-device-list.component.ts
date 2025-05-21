import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { PAGES } from 'src/app/shared/consts/routes';

@Component({
  selector: 'app-bluetooth-device-list',
  templateUrl: './bluetooth-device-list.component.html',
  styleUrls: ['./bluetooth-device-list.component.scss'],
  imports: [CommonModule, FontAwesomeModule]
})
export class BluetoothDeviceListComponent {
  //injections
  private bluetoothService = inject(BluetoothService);
  private router = inject(Router);

  //inputs
  scanResults = input.required<ScanResult[]>();

  //derived data
  filteredScanResults = computed(() => {
    return this.scanResults().filter(res => res.device.name?.includes('UCOM-CONNECT'))
  });

  //consts
  protected readonly actionIcon = faRocket;

  protected goToDevice(scanResult: ScanResult): void {
    this.router.navigate(
      [PAGES.device.route],
      { state: { scanResult } } //has to be named scanResult
    );
  }

}
