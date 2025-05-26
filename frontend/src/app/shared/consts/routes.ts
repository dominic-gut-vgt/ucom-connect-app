export const LEVEL_ONE_ROUTES = {
  home: 'Home',
  info: 'Info',
  settings: 'Settings',
  templates: 'Templates',
  createTemplate: 'CreateTemplate',
  createdTemplate: 'CreatedTemplate',
  device: 'Device',
}

export const ROUTE_PARAM_IDS = {
  scanResult: 'scanResult',
}

export const PAGES = {
  home: {
    route: `${LEVEL_ONE_ROUTES.home}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.home}`,
    name: 'Home',
  },
  device: {
    route: `${LEVEL_ONE_ROUTES.device}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.device}`,

    name: 'Device',
  },
  settings: {
    route: `${LEVEL_ONE_ROUTES.settings}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.settings}`,

    name: 'Settings',
  },
  info: {
    route: `${LEVEL_ONE_ROUTES.info}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.info}`,

    name: 'Info',
  },
  templates: {
    route: `${LEVEL_ONE_ROUTES.templates}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.templates}`,
    name: 'Templates',
  },
  createTemplate: {
    route: `${LEVEL_ONE_ROUTES.templates}/${LEVEL_ONE_ROUTES.createTemplate}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.createTemplate}`,
    name: 'Create Template',
  },
  createdTemplate: {
    route: `${LEVEL_ONE_ROUTES.templates}/${LEVEL_ONE_ROUTES.createdTemplate}`,
    relativeRoute: `${LEVEL_ONE_ROUTES.createdTemplate}`,
    name: 'Created Template',
  },
}