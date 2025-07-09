import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { UcomConnectcharacteristicTitle } from 'src/app/shared/enums/ucom-connect-characteristic-title.enum';
import { DeviceCharacteristicComponent } from '../common/device-characteristic/device-characteristic.component';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { faCheck, faInfoCircle, faWifi, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { MatExpansionModule } from '@angular/material/expansion';
import { bluetoothWriteValue } from 'src/app/shared/types/bluetooth.type';


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
    MatButtonModule,
  ],
})
export class DeviceStandardViewComponent implements OnInit, AfterViewInit, OnDestroy {
  //injections
  scanResult = input.required<ScanResult | undefined>();

  //consts
  protected readonly deviceIdCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.DeviceId);
  protected readonly cloudURICharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.CloudURI);
  protected readonly wifiPasswordCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiPassword);
  protected readonly wifiSSIDCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiSSID);
  protected readonly statusCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Status);
  protected readonly reconnectCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Reconnect);
  protected readonly restartCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Restart);

  protected readonly infoIcon = faInfoCircle;
  protected readonly finishedIcon = faCheck;
  protected readonly notFinishedIcon = faXmark;
  protected readonly connectIcon = faWifi;

  //viewchildren
  private stepper = viewChild<MatStepper>('stepper');

  private statusCharacteristicElem = viewChild<DeviceCharacteristicComponent>('statusCharacteristicElem');
  private cloudURICharacteristicElem = viewChild<DeviceCharacteristicComponent>('cloudURICharacteristicElem');
  private reconnectCharacteristicElem = viewChild<DeviceCharacteristicComponent>('reconnectCharacteristicElem');

  //data
  private interval: any;

  //flags
  protected finished = signal(false);
  protected deviceStatus = signal('');
  protected wifiConnectionTriggered = signal(false);
  protected connectedToWifi = signal(false);
  protected connectedToCloud = signal(false);
  protected cloudURIConnectionTriggered = signal(false);
  protected tryingToConnectToWifi = signal(false);  

  //derived flags
  protected deviceStatusInfo = computed(() => {
    return this.statusCharacteristic?.infos.find(info => info.valueKey === this.deviceStatus())?.description || 'Unknown status';
  });

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.statusCharacteristicElem()?.readCharacteristic();
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.setupCloudURICharacteristic();
  }

  private setupCloudURICharacteristic(): void {
    this.cloudURICharacteristicElem()?.setWriteValue('ws://51.103.222.244:8080/stream', BluetoothDataType.String128);
    this.cloudURICharacteristicElem()?.writeCharacteristic();
  }

  protected triggerWifiConnection(): void {
    this.reconnectCharacteristicElem()?.writeCharacteristic();
    this.wifiConnectionTriggered.set(true);
    this.tryingToConnectToWifi.set(true);

    setTimeout(() => {
      this.tryingToConnectToWifi.set(false);
    }, 10000);
  }

  protected triggerCloudURIConnection(): void {
    this.reconnectCharacteristicElem()?.writeCharacteristic();
    this.cloudURIConnectionTriggered.set(true);
    this.stepper()?.next();
  }

  //events
  protected onConsoleReadValueUpdated(): void {
    this.deviceStatus.set((this.statusCharacteristicElem()?.getWriteValue() as string) || '');

    //update flags based on device status
    const statusNumber = parseInt(this.deviceStatus().replace('S', ''), 10);

    this.finished.set(statusNumber === 11); //S11 is defined as finished

    this.connectedToWifi.set(statusNumber > 4);
    this.connectedToCloud.set(statusNumber >= 7);

    console.log('+++++++Device Status:', this.deviceStatus(), 'Connected to Wifi:', this.connectedToWifi(), 'Connected to Cloud:', this.connectedToCloud());
    /*
    this.consoleReadCount++;
    if (!this.finished()) {
      if (this.consoleReadCount === 10) {
        this.consoleReadCount = 0;
        this.reconnectCharacteristicElem()?.writeCharacteristic();
      }
    }
      */
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
