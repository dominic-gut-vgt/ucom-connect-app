import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { faGear, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class HomePage implements OnInit {

  //injections
  private readonly bluetoothService = inject(BluetoothService);

  //data
  protected scanIcon = signal(faSearch);

  //flags
  protected isScanning = signal(false)

  constructor() {
    this.bluetoothService.isScanningUpdated.subscribe((isScanning) => {
      console.log(isScanning);
      this.isScanning.set(isScanning);
      this.scanIcon.set(isScanning ? faGear : faSearch)
    });

    this.bluetoothService.scanResultUpdated.subscribe((scanResult) => {
      Object.values(scanResult).forEach((value) => {
        console.log("+++++++++", value);
      });
    });
  }

  ngOnInit() {
  }

  protected scanForDevices(): void {
    this.bluetoothService.scan();
  }

}
