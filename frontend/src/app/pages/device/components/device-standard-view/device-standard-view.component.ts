import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { UcomConnectcharacteristicTitle } from 'src/app/shared/enums/ucom-connect-characteristic-title.enum';
import { DeviceCharacteristicComponent } from '../common/device-characteristic/device-characteristic.component';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
  ],
})
export class DeviceStandardViewComponent implements OnInit, OnDestroy {
  //injections
  scanResult = input.required<ScanResult | undefined>();

  //consts
  protected readonly wifiPasswordCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiPassword);
  protected readonly wifiSSIDCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiSSID);
  protected readonly consoleCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Console);
  protected readonly finishedIcon = faCheck;
  protected readonly notFinishedIcon = faXmark;

  //viewchildren
  private consoleCharacteristicElem = viewChild<DeviceCharacteristicComponent>('consoleCharacteristicElem');

  //data
  private interval: any;

  //flags
  protected finished = signal(false);

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.consoleCharacteristicElem()?.readCharacteristic();
    }, 2000);
  }

  onConsoleReadValueUpdated(): void {
    const value = this.consoleCharacteristicElem()?.getWriteValue();
    this.finished.set(value === 'S11'); //S11 is defined as finished
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
