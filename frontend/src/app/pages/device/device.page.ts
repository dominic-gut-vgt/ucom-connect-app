import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { UserMode } from 'src/app/shared/enums/user-mode.enum';
import { DeviceStandardViewComponent } from './components/device-standard-view/device-standard-view.component';
import { DeviceProViewComponent } from './components/device-pro-view/device-pro-view.component';
import { Router } from '@angular/router';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { ROUTE_PARAM_IDS } from 'src/app/shared/consts/routes';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DeviceStandardViewComponent,
    DeviceProViewComponent,
  ]
})
export class DevicePage implements OnInit {
  //injections
  private userService = inject(UserService);
  private router = inject(Router);

  //consts
  protected readonly userMode = UserMode;

  //data
  protected currentUserMode = this.userService.currentUserModeReadonly
  protected scanResult = signal<ScanResult | undefined>(undefined);

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.scanResult.set(nav?.extras?.state?.[ROUTE_PARAM_IDS.scanResult]);
  }
}
