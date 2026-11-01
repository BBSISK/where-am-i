import { describe, it, expect } from 'vitest';
import {
  coordinateToH3,
  getCellBoundary,
  getCellCenter,
  getCorridorNeighbors,
  calculateHaversineDistance,
  calculateBearing,
  H3_DEFAULT_RESOLUTION
} from './spatialEngine';

describe('Spatial Engine (Uber H3 & Geodesics)', () => {
  const galwayCoord = { lat: 53.2707, lng: -9.0568 };
  const dublinCoord = { lat: 53.3498, lng: -6.2603 };

  it('correctly maps coordinates to an Uber H3 Resolution 8 cell ID', () => {
    const h3Index = coordinateToH3(galwayCoord, H3_DEFAULT_RESOLUTION);
    expect(h3Index).toBeDefined();
    expect(typeof h3Index).toBe('string');
    expect(h3Index.startsWith('88')).toBe(true); // Res 8 index prefix
  });

  it('extracts exactly 6 polygon vertices for hexagonal boundary rendering', () => {
    const h3Index = coordinateToH3(galwayCoord);
    const boundary = getCellBoundary(h3Index);
    expect(boundary.length).toBe(6);
    boundary.forEach(([lat, lng]) => {
      expect(typeof lat).toBe('number');
      expect(typeof lng).toBe('number');
      expect(lat).toBeGreaterThan(50);
      expect(lat).toBeLessThan(56);
      expect(lng).toBeGreaterThan(-11);
      expect(lng).toBeLessThan(-5);
    });
  });

  it('calculates the centroid within the boundary bounds', () => {
    const h3Index = coordinateToH3(dublinCoord);
    const center = getCellCenter(h3Index);
    expect(center.lat).toBeCloseTo(dublinCoord.lat, 1);
    expect(center.lng).toBeCloseTo(dublinCoord.lng, 1);
  });

  it('performs k-ring corridor expansion for route prefetching', () => {
    const h3Index = coordinateToH3(galwayCoord);
    // Ring radius 1 gives 1 center + 6 neighbors = 7 cells
    const neighborsR1 = getCorridorNeighbors(h3Index, 1);
    expect(neighborsR1.length).toBe(7);
    expect(neighborsR1).toContain(h3Index);

    // Ring radius 2 gives 19 cells
    const neighborsR2 = getCorridorNeighbors(h3Index, 2);
    expect(neighborsR2.length).toBe(19);
  });

  it('accurately computes Haversine great-circle distance across Ireland', () => {
    // Dublin to Galway is approximately 185 - 210 km as the crow flies
    const distanceMeters = calculateHaversineDistance(dublinCoord, galwayCoord);
    const distanceKm = distanceMeters / 1000;
    expect(distanceKm).toBeGreaterThan(180);
    expect(distanceKm).toBeLessThan(200);
  });

  it('calculates heading bearing degrees correctly', () => {
    const p1 = { lat: 53.0, lng: -8.0 };
    const dueNorth = { lat: 54.0, lng: -8.0 };
    const dueEast = { lat: 53.0, lng: -7.0 };

    expect(calculateBearing(p1, dueNorth)).toBeCloseTo(0, 0);
    expect(calculateBearing(p1, dueEast)).toBeCloseTo(90, 0);
  });
});
