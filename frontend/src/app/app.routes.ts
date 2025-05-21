import { Routes } from '@angular/router';
import { PAGES, ROUTE_PARAM_IDS } from './shared/consts/routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: PAGES.home.route,
    pathMatch: 'full',
  },
  {
    path: PAGES.home.route,
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: PAGES.settings.route,
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  },
  {
    path: PAGES.info.route,
    loadComponent: () => import('./pages/info/info.page').then(m => m.InfoPage)
  },
  {
    path: `${PAGES.device.route}`,
    children: [
      {
        path: `:${ROUTE_PARAM_IDS.id}`,
        loadComponent: () => import('./pages/device/device.page').then(m => m.DevicePage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PAGES.home.route, // redirect to home if no :id
      }
    ]
  },
];
