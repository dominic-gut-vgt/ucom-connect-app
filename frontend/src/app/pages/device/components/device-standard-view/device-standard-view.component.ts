import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
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
export class DeviceStandardViewComponent {
  //injections
  scanResult = input.required<ScanResult | undefined>();

  //consts
  protected readonly wifiPasswordCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiPassword);
  protected readonly wifiSSIDCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.WifiSSID);
  protected readonly consoleCharacteristic = UCOM_CONNECT_CHARACTERISTICS.find(c => c.title === UcomConnectcharacteristicTitle.Console);
  protected readonly finishedIcon = faCheck;
  protected readonly notFinishedIcon = faXmark;

  //flags
  protected finished = signal(false);

  onConsoleReadValueUpdated(value: string): void {

  }
}
