import { CapacitorConfig } from '@capacitor/cli';

interface ExtendedCapacitorConfig extends CapacitorConfig {
  versionName?: string;
  versionCode?: number;
} 

const config: ExtendedCapacitorConfig = {
  appId: 'com.wishalink',
  appName: 'Wish A Link',
  versionName: "1.3.9",
  versionCode: 10309,
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    'SplashScreen': {
      launchShowDuration: 1000,
      launchAutoHide: false,
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      splashFullScreen: false,
      splashImmersive: false
    }
  }
};

export default config;
