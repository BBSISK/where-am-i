import { GeoCoordinate } from '../types';
import { coordinateToH3, calculateBearing, calculateHaversineDistance } from './spatialEngine';

export interface RealGpsState {
  status: 'idle' | 'requesting' | 'locked' | 'error' | 'unsupported';
  coordinate: GeoCoordinate | null;
  accuracyMeters: number;
  speedKmh: number;
  heading: number;
  altitudeMeters: number | null;
  h3Index: string | null;
  errorMessage: string | null;
  isScreenWakeLocked: boolean;
  totalDistanceDrivenMeters: number;
}

class RealGpsService {
  private watchId: number | null = null;
  private wakeLock: any = null;
  private lastCoordinate: GeoCoordinate | null = null;
  private lastH3Index: string | null = null;
  private totalDistance: number = 0;
  private listeners: Set<(state: RealGpsState) => void> = new Set();
  private cellEntryListeners: Set<(newCellId: string, coord: GeoCoordinate, speedKmh: number) => void> = new Set();

  private currentState: RealGpsState = {
    status: 'idle',
    coordinate: null,
    accuracyMeters: 0,
    speedKmh: 0,
    heading: 0,
    altitudeMeters: null,
    h3Index: null,
    errorMessage: null,
    isScreenWakeLocked: false,
    totalDistanceDrivenMeters: 0
  };

  public subscribe(listener: (state: RealGpsState) => void) {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onCellEntry(listener: (newCellId: string, coord: GeoCoordinate, speedKmh: number) => void) {
    this.cellEntryListeners.add(listener);
    return () => {
      this.cellEntryListeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.currentState }));
  }

  public async startTracking(): Promise<void> {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      this.currentState = {
        ...this.currentState,
        status: 'unsupported',
        errorMessage: 'Geolocation is not supported by your browser.'
      };
      this.notify();
      return;
    }

    this.currentState = {
      ...this.currentState,
      status: 'requesting',
      errorMessage: null
    };
    this.notify();

    // Request Screen Wake Lock so phone doesn't sleep while driving on car mount
    await this.requestWakeLock();

    // Re-acquire wake lock if driver switches apps and comes back
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.currentState.status === 'locked') {
          this.requestWakeLock();
        }
      });
    }

    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS satellite sensor, not just Wi-Fi triangulation
      maximumAge: 1000,         // Don't accept stale coordinates older than 1 second
      timeout: 15000            // 15 second timeout to acquire initial lock
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handleGpsUpdate(position),
      (error) => this.handleGpsError(error),
      options
    );
  }

  private handleGpsUpdate(position: GeolocationPosition) {
    const rawLat = position.coords.latitude;
    const rawLng = position.coords.longitude;
    const accuracy = Math.round(position.coords.accuracy);
    const altitude = position.coords.altitude !== null ? Math.round(position.coords.altitude) : null;

    // Convert velocity: m/s to km/h (fallback to 0 if stationary or negative)
    let speedKmh = 0;
    if (position.coords.speed !== null && position.coords.speed > 0) {
      speedKmh = Math.round(position.coords.speed * 3.6);
    }

    const newCoord: GeoCoordinate = { lat: rawLat, lng: rawLng };

    // Jitter filtering: if stationary (< 2 km/h) and moved < 8 meters, ignore jitter
    let heading = this.currentState.heading;
    if (this.lastCoordinate) {
      const movedMeters = calculateHaversineDistance(this.lastCoordinate, newCoord);
      if (movedMeters > 5) {
        this.totalDistance += movedMeters;
        // Calculate bearing from trajectory if phone compass heading not provided
        if (position.coords.heading !== null && !isNaN(position.coords.heading)) {
          heading = Math.round(position.coords.heading);
        } else {
          heading = Math.round(calculateBearing(this.lastCoordinate, newCoord));
        }
      }
    } else if (position.coords.heading !== null && !isNaN(position.coords.heading)) {
      heading = Math.round(position.coords.heading);
    }

    // Convert to discrete Uber H3 Resolution 8 Hex ID
    const currentH3 = coordinateToH3(newCoord, 8);

    // Check if entered a new 1km H3 hex cell
    if (this.lastH3Index && currentH3 !== this.lastH3Index) {
      // Fire cell entry listeners
      this.cellEntryListeners.forEach((fn) => fn(currentH3, newCoord, speedKmh));
    }

    this.lastCoordinate = newCoord;
    this.lastH3Index = currentH3;

    this.currentState = {
      status: 'locked',
      coordinate: newCoord,
      accuracyMeters: accuracy,
      speedKmh,
      heading,
      altitudeMeters: altitude,
      h3Index: currentH3,
      errorMessage: null,
      isScreenWakeLocked: !!this.wakeLock,
      totalDistanceDrivenMeters: Math.round(this.totalDistance)
    };

    this.notify();
  }

  private handleGpsError(error: GeolocationPositionError) {
    let msg = 'Failed to acquire GPS location.';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        msg = 'Location permission denied. Please allow location access in your browser settings to track while driving.';
        break;
      case error.POSITION_UNAVAILABLE:
        msg = 'GPS signal unavailable. Ensure your phone has a clear view of the sky.';
        break;
      case error.TIMEOUT:
        msg = 'GPS acquisition timed out. Re-attempting lock...';
        break;
    }

    this.currentState = {
      ...this.currentState,
      status: 'error',
      errorMessage: msg
    };
    this.notify();
  }

  private async requestWakeLock() {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.currentState.isScreenWakeLocked = true;
        this.wakeLock.addEventListener('release', () => {
          this.currentState.isScreenWakeLocked = false;
          this.wakeLock = null;
        });
      } catch (err) {
        console.warn('Wake Lock request error (browser may restrict in non-HTTPS or low battery):', err);
      }
    }
  }

  public stopTracking(): void {
    if (this.watchId !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
    this.currentState = {
      ...this.currentState,
      status: 'idle',
      isScreenWakeLocked: false
    };
    this.notify();
  }

  public getState(): RealGpsState {
    return this.currentState;
  }
}

export const realGpsService = new RealGpsService();
