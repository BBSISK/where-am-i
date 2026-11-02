import { SimulatedRoute } from '../types';

/**
 * Simulated test routes ONLY (for testing without driving).
 * Waypoints are plain place names and coordinates: no heritage claims.
 * All previous route descriptions were removed in the 2026-11 rebuild (unverified content).
 */
export const SIMULATED_ROUTES: SimulatedRoute[] = [
  {
    id: 'test-lucan-leixlip-maynooth',
    title: 'Test route: Lucan → Leixlip → Maynooth (simulated)',
    region: 'Dublin / Kildare',
    description: 'A simulated drive for testing. Only verified content is shown or spoken.',
    distanceKm: 10, // approx. straight-line distance between waypoints
    estimatedDriveTime: 'Simulated',
    waypoints: [
      { coordinate: { lat: 53.3575, lng: -6.4485 }, name: 'Lucan', roadName: 'Test route (simulated)', speedLimitKmh: 60 },
      { coordinate: { lat: 53.3639, lng: -6.495 }, name: 'Leixlip', roadName: 'Test route (simulated)', speedLimitKmh: 60 },
      { coordinate: { lat: 53.3813, lng: -6.5918 }, name: 'Maynooth', roadName: 'Test route (simulated)', speedLimitKmh: 60 }
    ]
  }
];
