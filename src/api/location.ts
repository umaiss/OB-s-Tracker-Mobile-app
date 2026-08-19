import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { GeoPoint } from './tasksApi';

export type CurrentPosition = GeoPoint & {
  accuracyMeters: number;
  isMoving: boolean;
};

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export function getCurrentPosition(
  timeoutMs = 10000,
): Promise<CurrentPosition> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy, speed } = position.coords;
        resolve({
          latitude,
          longitude,
          recordedAt: new Date(position.timestamp).toISOString(),
          accuracyMeters: accuracy ?? 0,
          isMoving: (speed ?? 0) > 0.3,
        });
      },
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      },
    );
  });
}
