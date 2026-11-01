import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { realGpsService } from './realGpsService';

describe('RealGpsService Tracking & Teaser Trigger State', () => {
  const originalWindow = (globalThis as any).window;
  let mockGeo: any;

  beforeAll(() => {
    mockGeo = {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn().mockReturnValue(123),
      clearWatch: vi.fn()
    };
    (globalThis as any).window = globalThis;
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: mockGeo,
      configurable: true,
      writable: true
    });
  });

  afterAll(() => {
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
  });

  beforeEach(() => {
    realGpsService.stopTracking();
  });

  it('initializes with idle status and isTracking false', () => {
    const state = realGpsService.getState();
    expect(state.status).toBe('idle');
    expect(state.isTracking).toBe(false);
  });

  it('updateLocationManually updates coordinates without activating tracking', () => {
    const lucanCoord = { lat: 53.3575, lng: -6.4485 };
    realGpsService.updateLocationManually(lucanCoord, 10);

    const state = realGpsService.getState();
    expect(state.status).toBe('locked');
    expect(state.isTracking).toBe(false);
    expect(state.coordinate).toEqual(lucanCoord);
    expect(state.h3Index).toBeDefined();
  });

  it('startTracking sets isTracking true and status requesting', async () => {
    await realGpsService.startTracking();

    const state = realGpsService.getState();
    expect(state.isTracking).toBe(true);
    expect(state.status).toBe('requesting');

    realGpsService.stopTracking();
  });

  it('fires cellEntryListeners on first fix when tracking is active', async () => {
    let capturedCell: string | null = null;
    const unsub = realGpsService.onCellEntry((h3) => {
      capturedCell = h3;
    });

    let watchSuccessCallback: any = null;
    mockGeo.getCurrentPosition = vi.fn((cb) => {
      watchSuccessCallback = cb;
    });

    await realGpsService.startTracking();

    // Simulate satellite signal acquisition callback
    if (watchSuccessCallback) {
      watchSuccessCallback({
        coords: {
          latitude: 53.3575,
          longitude: -6.4485,
          accuracy: 10,
          altitude: null,
          speed: null,
          heading: null
        }
      });
    }

    expect(capturedCell).toBeDefined();
    const state = realGpsService.getState();
    expect(state.status).toBe('locked');
    expect(state.isTracking).toBe(true);

    unsub();
    realGpsService.stopTracking();
  });
});
