import { CapacitorConfig } from '@capacitor/cli';

interface ExtendedCapacitorConfig extends CapacitorConfig {
  versionName?: string;
  versionCode?: number;
} 

const config: ExtendedCapacitorConfig = {
  appId: 'com.wishalink',
  appName: 'Wish A Link',
  versionName: "1.4.6",
  versionCode: 10406,
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    'SplashScreen': {
      launchShowDuration: 1000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    }
  }
};

export default config;
