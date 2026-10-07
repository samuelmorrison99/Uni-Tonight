import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export const getCurrentCoordinates = async (): Promise<[number, number]> => {
  if (Capacitor.isNativePlatform()) {
    try {
      // 1. Check current native location permission status
      const permissionStatus = await Geolocation.checkPermissions();
      
      // 2. Request native location permissions if not already granted
      if (permissionStatus.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          throw new Error('Native location permission was denied by the user.');
        }
      }

      // 3. Request coordinates from native GPS services
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      return [position.coords.latitude, position.coords.longitude];
    } catch (err: any) {
      console.warn("Capacitor Native Geolocation error, falling back to browser API: ", err);
    }
  }

  // Fallback: Web browser navigator geolocation APIs
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        reject(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};
