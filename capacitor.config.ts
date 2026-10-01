import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuitionmanager.app',
  appName: 'TuitionMate',
  webDir: 'public',
  server: {
    url: 'https://tution-qrattend.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
