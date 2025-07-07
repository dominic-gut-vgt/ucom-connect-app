import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Settings } from '../../interfaces/settings.interface';
import { UserMode } from '../../enums/user-mode.enum';
import { inject } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';

type SettingsState = {
  settings: Settings;
  isLoading: boolean;
};

const initialState: SettingsState = {
  settings: {
    userMode: UserMode.Standard
  },
  isLoading: false,
};

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, localStorageService = inject(LocalStorageService)) => ({

    //load --------------------------------------------------------------------------------------------------
    async loadSettings(): Promise<void> {
      patchState(store, { isLoading: true });
      const settings = await localStorageService.getItem<Settings>(LocalStorageKey.Settings);
      if (!settings) {
        await localStorageService.setItem<Settings>(LocalStorageKey.Settings, store.settings());
      } else {
        patchState(store, { settings: settings, isLoading: false });
      }
    },

    //update ------------------------------------------------------------------------------------------------
    async saveSettings(settings: Settings): Promise<void> {
      await localStorageService.setItem<Settings>(LocalStorageKey.Settings, settings);
      patchState(store, { settings: settings });
    },
  })),
  withHooks({
    onInit({loadSettings  }) {
        loadSettings();
    },
  }),
);