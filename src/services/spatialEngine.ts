import * as h3 from 'h3-js';
import { GeoCoordinate } from '../types';

export const H3_DEFAULT_RESOLUTION = 8; // ~0.737 km2, edge ~461m

/**
 * Converts GPS (lat, lng) to an Uber H3 Res 8 hexagonal cell ID in O(1) time.
 */
export function coordinateToH3(coord: GeoCoordinate, resolution: number = H3_DEFAULT_RESOLUTION): string {
  return h3.latLngToCell(coord.lat, coord.lng, resolution);
}

/**
 * Returns the exact 6 polygon vertices [[lat, lng], ...] of an H3 cell.
 */
export function getCellBoundary(h3Index: string): [number, number][] {
  try {
    return h3.cellToBoundary(h3Index);
  } catch (err) {
    console.error(`Failed to get boundary for H3 ${h3Index}:`, err);
    return [];
  }
}

/**
 * Returns the centroid (lat, lng) of an H3 cell.
 */
export function getCellCenter(h3Index: string): GeoCoordinate {
  const [lat, lng] = h3.cellToLatLng(h3Index);
  return { lat, lng };
}

/**
 * Pre-fetches surrounding corridor cells using H3 gridDisk (k-ring expansion).
 * Returns array of neighbor H3 indexes.
 */
export function getCorridorNeighbors(h3Index: string, ringRadius: number = 2): string[] {
  try {
    return h3.gridDisk(h3Index, ringRadius);
  } catch (err) {
    console.error(`Failed to expand gridDisk for H3 ${h3Index}:`, err);
    return [h3Index];
  }
}

/**
 * Great-circle distance between two GPS coordinates using Haversine formula (in meters).
 */
export function calculateHaversineDistance(c1: GeoCoordinate, c2: GeoCoordinate): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (c1.lat * Math.PI) / 180;
  const phi2 = (c2.lat * Math.PI) / 180;
  const deltaPhi = ((c2.lat - c1.lat) * Math.PI) / 180;
  const deltaLambda = ((c2.lng - c1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Calculates bearing from start to finish coordinate in degrees (0 = North, 90 = East, 180 = South, 270 = West).
 */
export function calculateBearing(start: GeoCoordinate, end: GeoCoordinate): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

