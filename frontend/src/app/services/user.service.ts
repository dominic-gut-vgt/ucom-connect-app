import { Injectable, signal } from '@angular/core';
import { UserMode } from '../shared/enums/user-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserMode=signal(UserMode.Standard);
  public currentUserModeReadonly = this.currentUserMode.asReadonly();

  constructor() { }

}
