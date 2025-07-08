import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { UcomConnectcharacteristicTitle } from 'src/app/shared/enums/ucom-connect-characteristic-title.enum';
import { DeviceCharacteristicComponent } from '../common/device-characteristic/device-characteristic.component';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { faCheck, faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-device-standard-view',
  templateUrl: './device-standard-view.component.html',
  styleUrls: ['./device-standard-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule,
    DeviceCharacteristicComponent,
    //material
    MatStepperModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
})
export class DeviceStandardViewComponent implements OnInit, AfterViewInit, OnDestroy {
  //injections
  scanResult = input.required<ScanResult | undefined>();

  //consts
  protected readonly cloudURICharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.CloudURI);
  protected readonly wifiPasswordCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiPassword);
  protected readonly wifiSSIDCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiSSID);
  protected readonly statusCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Status);
  protected readonly reconnectCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Reconnect);
  protected readonly restartCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Restart);

  protected readonly infoIcon = faInfoCircle;
  protected readonly finishedIcon = faCheck;
  protected readonly notFinishedIcon = faXmark;

  //viewchildren
  private statusCharacteristicElem = viewChild<DeviceCharacteristicComponent>('statusCharacteristicElem');
  private cloudURICharacteristicElem = viewChild<DeviceCharacteristicComponent>('cloudURICharacteristicElem');

  //data
  private interval: any;

  //flags
  protected finished = signal(false);

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.statusCharacteristicElem()?.readCharacteristic();
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.setupCloudURICharacteristic();
  }

  private setupCloudURICharacteristic(): void {
    this.cloudURICharacteristicElem()?.setWriteValue('https://ucom-connect.cloud', BluetoothDataType.String);
    this.cloudURICharacteristicElem()?.writeCharacteristic();
  }

  //events
  protected onConsoleReadValueUpdated(): void {
    const value = this.statusCharacteristicElem()?.getWriteValue();
    this.finished.set(value === 'S11'); //S11 is defined as finished
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
