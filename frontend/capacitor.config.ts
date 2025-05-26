import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'energy.vgt.ucomconnectapp',
  appName: 'VGT UCOM Connect',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#ffffffff",
    },
  }
};

export default config;
