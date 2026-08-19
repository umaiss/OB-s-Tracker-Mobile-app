import Geolocation from 'react-native-geolocation-service';
import BackgroundFetch from 'react-native-background-fetch';
import DeviceInfo from 'react-native-device-info';
import { v4 as uuidv4 } from '../utils/uuid';
import { PermissionsAndroid, Platform } from 'react-native';
import { LocationPoint } from '../api/tasksApi';

let watchId: number | null = null;
let lastPoint: { lat: number; lng: number; time: number } | null = null;

const MOVING_SPEED_THRESHOLD_MPS = 0.5; // ~1.8 km/h — below this, treated as stationary

async function requestPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const fine = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (fine !== PermissionsAndroid.RESULTS.GRANTED) return false;

  if (Platform.Version >= 29) {
    // Not fatal if denied — foreground tracking still works without it.
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
  }
  return true;
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  const granted = await requestPermissions();
  if (!granted) {
    throw new Error('Location permission denied');
  }
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      error => reject(new Error(error.message || 'Could not get current location')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeIsMoving(lat: number, lng: number, timestamp: number): boolean {
  if (!lastPoint) return true; // first point of the task — assume moving
  const distanceM = haversineMeters(lastPoint.lat, lastPoint.lng, lat, lng);
  const seconds = (timestamp - lastPoint.time) / 1000;
  if (seconds <= 0) return true;
  return distanceM / seconds >= MOVING_SPEED_THRESHOLD_MPS;
}

async function buildPoint(position: any): Promise<LocationPoint> {
  const { latitude, longitude, accuracy } = position.coords;
  const timestamp: number = position.timestamp;

  const isMoving = computeIsMoving(latitude, longitude, timestamp);
  lastPoint = { lat: latitude, lng: longitude, time: timestamp };

  let batteryLevel: number | undefined;
  try {
    batteryLevel = Math.round((await DeviceInfo.getBatteryLevel()) * 100);
  } catch {
    batteryLevel = undefined;
  }

  return {
    clientId: uuidv4(),
    latitude,
    longitude,
    recordedAt: new Date(timestamp).toISOString(),
    accuracyMeters: accuracy ?? undefined,
    isMoving,
    batteryLevel,
  };
}

export async function startTracking(onPoint: (point: LocationPoint) => void): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) {
    throw new Error('Location permission denied');
  }

  lastPoint = null;

  // Foreground: frequent updates while the screen is open.
  watchId = Geolocation.watchPosition(
    position => {
      buildPoint(position).then(onPoint);
    },
    error => console.warn('watchPosition error:', error),
    { enableHighAccuracy: true, distanceFilter: 10, interval: 30000, fastestInterval: 15000 },
  );

  // Background: periodic safety net for when the app isn't in the foreground.
  // Android's own scheduler enforces a practical minimum interval around 15 minutes —
  // this is an OS-level constraint, not something app code can override.
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },
    (taskId: string) => {
      Geolocation.getCurrentPosition(
        position => {
          buildPoint(position).then(onPoint);
          BackgroundFetch.finish(taskId);
        },
        () => BackgroundFetch.finish(taskId),
        { enableHighAccuracy: true },
      );
    },
    (taskId: string) => console.warn('BackgroundFetch timeout:', taskId),
  );
  await BackgroundFetch.start();
}

export function stopTracking(): void {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
  BackgroundFetch.stop();
  lastPoint = null;
}