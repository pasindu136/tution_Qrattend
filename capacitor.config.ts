import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuitionmanager.app',
  appName: 'Tuition Manager',
  webDir: 'public',
  server: {
    url: 'https://tution-management-nine.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
