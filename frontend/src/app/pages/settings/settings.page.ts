import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCodeBranch, faSliders} from '@fortawesome/free-solid-svg-icons';
import { APP_DATA } from 'src/app/shared/consts/app-data';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLabel } from '@angular/material/input';
import { USER_MODE_MAP, UserMode } from 'src/app/shared/enums/user-mode.enum';
import { SettingsStore } from 'src/app/shared/stores/settings/settings-store';
import { Settings } from 'src/app/shared/interfaces/settings.interface';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatLabel, MatSlideToggle]
})
export class SettingsPage {

  //injections
  private settingsStore = inject(SettingsStore);

  //consts
  protected readonly userModeMap = USER_MODE_MAP;
  protected readonly userModes = Object.keys(USER_MODE_MAP).map(key => key as UserMode);
  protected readonly userModeEnum = UserMode;

  //icons
  protected readonly versionIcon = faCodeBranch;
  protected readonly modeIcon = faSliders;
  protected readonly appVersion = APP_DATA.appVersion;

  //data
  protected userModeIsPro = signal(true);

  //flags
  private inited = false;

  constructor() {
    effect(() => {
      console.log(this.settingsStore.settings());
      if (this.settingsStore.isLoaded()) {
        if (!this.inited) {
          this.init();
        }
      } else {
        this.inited = false
      }
    });
  }

  private init(): void {
    this.userModeIsPro.set(this.settingsStore.settings().userMode === UserMode.Pro);
    
    this.inited = true;
  }


  protected onUserModeChange(event: MatSlideToggleChange): void {
    const userMode = event.checked ? UserMode.Pro : UserMode.Standard;
    const newSettings: Settings = { ...this.settingsStore.settings(), userMode: userMode };
    this.settingsStore.saveSettings(newSettings);
  }
}
