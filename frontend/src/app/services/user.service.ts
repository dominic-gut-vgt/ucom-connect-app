import { inject, Injectable, signal } from '@angular/core';
import { UserMode } from '../shared/enums/user-mode.enum';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKey } from '../shared/enums/local-storage-key.enum';
import { Settings } from '../shared/interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /*
  //injections
  private localStorageService = inject(LocalStorageService);

  //data
  private currentUserMode=signal(UserMode.Standard);
  public currentUserModeReadonly = this.currentUserMode.asReadonly();


  constructor() {
    
    // Load user mode from local storage if available
    this.localStorageService.getItem<Settings>(LocalStorageKey.Settings).then((settings) => {
      if (settings) {
        this.currentUserMode.set(mode);
      }
    });
  }

  public setUserMode(mode: UserMode) {
    this.currentUserMode.set(mode);
    this.localStorageService.setItem(LocalStorageKey.Settings, mode);
  }
    */

}
