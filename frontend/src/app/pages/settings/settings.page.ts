import { Component, effect, inject, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCodeBranch, faSliders, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { APP_DATA } from 'src/app/shared/consts/app-data';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { USER_MODE_MAP, UserMode } from 'src/app/shared/enums/user-mode.enum';
import { SettingsStore } from 'src/app/shared/stores/settings/settings-store';
import { Settings } from 'src/app/shared/interfaces/settings.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [CommonModule, FontAwesomeModule, MatFormField, MatLabel, MatSelect, MatOption]
})
export class SettingsPage {

  //injections
  private settingsStore = inject(SettingsStore);

  //consts
  protected readonly userModeMap = USER_MODE_MAP;
  protected readonly userModes = Object.keys(USER_MODE_MAP).map(key => key as UserMode);
  //icons
  protected readonly versionIcon = faCodeBranch;
  protected readonly modeIcon = faSliders;
  protected readonly appVersion = APP_DATA.appVersion;

  //data
  protected userMode = linkedSignal(() => this.settingsStore.settings.userMode());

  onUserModeChange() {
    const newSettings:Settings = { ...this.settingsStore.settings(), userMode: this.userMode() };
    this.settingsStore.saveSettings(newSettings);
  }
}
