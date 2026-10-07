import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import type { BannerAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const initializeAdMob = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await AdMob.initialize({});
      console.log('AdMob initialized successfully');
    } catch (err) {
      console.warn('Failed to initialize AdMob', err);
    }
  }
};

export const showBannerAd = async (adUnitId: string) => {
  if (Capacitor.isNativePlatform()) {
    try {
      const options: BannerAdOptions = {
        adId: adUnitId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true, // IMPORTANT: Leave this as true until we are ready for production to avoid Google bans
      };
      await AdMob.showBanner(options);
    } catch (err) {
      console.warn('Failed to show banner ad', err);
    }
  }
};

export const hideBannerAd = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await AdMob.hideBanner();
    } catch (err) {
      console.warn('Failed to hide banner', err);
    }
  }
};
