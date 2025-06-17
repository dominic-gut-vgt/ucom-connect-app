import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { UserMode } from 'src/app/shared/enums/user-mode.enum';
import { DeviceStandardViewComponent } from './components/device-standard-view/device-standard-view.component';
import { DeviceProViewComponent } from './components/device-pro-view/device-pro-view.component';

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

  //consts
  protected readonly userMode = UserMode;

  //data
  protected currentUserMode = this.userService.currentUserModeReadonly

  ngOnInit(): void {

  }
}
