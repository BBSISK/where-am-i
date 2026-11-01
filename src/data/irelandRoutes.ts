import { SimulatedRoute } from '../types';

export const SIMULATED_ROUTES: SimulatedRoute[] = [
  {
    id: 'route-connemara-n59',
    title: 'The Wild Atlantic Way: Galway to Connemara',
    region: 'County Galway / Connemara',
    description: 'Traverses the dramatic transition from the shores of Lough Corrib through the Maam Valley and Twelve Bens into the Atlantic peatlands.',
    distanceKm: 78,
    estimatedDriveTime: '1 hr 15 mins',
    waypoints: [
      {
        coordinate: { lat: 53.2707, lng: -9.0568 },
        name: 'Galway City (Claddagh & Corrib Estuary)',
        roadName: 'N59 Westbound',
        speedLimitKmh: 50
      },
      {
        coordinate: { lat: 53.3320, lng: -9.1840 },
        name: 'Moycullen (Maigh Cuilinn)',
        roadName: 'N59 Connemara Spine',
        speedLimitKmh: 80
      },
      {
        coordinate: { lat: 53.4248, lng: -9.3242 },
        name: 'Oughterard (Uachtar Ard - Gateway to Lough Corrib)',
        roadName: 'N59 Lough Shore',
        speedLimitKmh: 60
      },
      {
        coordinate: { lat: 53.4890, lng: -9.5420 },
        name: 'Maam Cross (An Mám - Heart of Connemara)',
        roadName: 'N59 Crossroads',
        speedLimitKmh: 100
      },
      {
        coordinate: { lat: 53.4735, lng: -9.7310 },
        name: 'Recess & Derryclare Lough (Binn Bhán View)',
        roadName: 'N59 Glacial Valley',
        speedLimitKmh: 80
      },
      {
        coordinate: { lat: 53.4880, lng: -9.9210 },
        name: 'Clifden (Clochán - Capital of Connemara)',
        roadName: 'Sky Road Terminus',
        speedLimitKmh: 50
      }
    ]
  },
  {
    id: 'route-ancient-east-m7',
    title: 'The Ancient East Corridor: Dublin to Rock of Dunamase',
    region: 'Kildare / Laois Heartland',
    description: 'Follows the prehistoric Slí Dála route past the Curragh plains, ancient eskers, St. Brigid’s oak grove, and Norman defensive hillforts.',
    distanceKm: 85,
    estimatedDriveTime: '1 hr 05 mins',
    waypoints: [
      {
        coordinate: { lat: 53.3498, lng: -6.2603 },
        name: 'Dublin (Baile Átha Cliath - Ford of the Reed Hurdles)',
        roadName: 'R148 / N7 Outbound',
        speedLimitKmh: 50
      },
      {
        coordinate: { lat: 53.2198, lng: -6.6669 },
        name: 'Naas (Nás na Ríogh - Assembly Place of Kings)',
        roadName: 'M7 Motorway',
        speedLimitKmh: 100
      },
      {
        coordinate: { lat: 53.1590, lng: -6.8120 },
        name: 'The Curragh Plains (An Currach - Glacial Plain)',
        roadName: 'M7 Plains Corridor',
        speedLimitKmh: 120
      },
      {
        coordinate: { lat: 53.1585, lng: -6.9100 },
        name: 'Kildare Town (Cill Dara - Church of the Oak)',
        roadName: 'M7 Heritage Exit',
        speedLimitKmh: 80
      },
      {
        coordinate: { lat: 53.0325, lng: -7.2185 },
        name: 'Rock of Dunamase (Dún Masc - Limestone Citadel)',
        roadName: 'R445 Dunamase Approach',
        speedLimitKmh: 60
      }
    ]
  },
  {
    id: 'route-ring-of-kerry-n70',
    title: 'The Kingdom Pass: Killarney to Kenmare & Ringfort Coast',
    region: 'County Kerry / Iveragh Peninsula',
    description: 'Mountain pass through Moll’s Gap and Ladies View, descending into deep archaeological stone ringfort territories and Ogham heritage.',
    distanceKm: 65,
    estimatedDriveTime: '1 hr 20 mins',
    waypoints: [
      {
        coordinate: { lat: 52.0599, lng: -9.5044 },
        name: 'Killarney (Cill Airne - Church of the Sloes)',
        roadName: 'N71 Southbound',
        speedLimitKmh: 50
      },
      {
        coordinate: { lat: 51.9680, lng: -9.5850 },
        name: 'Ladies View & Upper Lake (Glacial Fjord)',
        roadName: 'N71 Mountain Pass',
        speedLimitKmh: 70
      },
      {
        coordinate: { lat: 51.9330, lng: -9.6520 },
        name: 'Moll’s Gap (Bhearna Mholla - Devonian Sandstone)',
        roadName: 'N71 Summit',
        speedLimitKmh: 60
      },
      {
        coordinate: { lat: 51.8795, lng: -9.5830 },
        name: 'Kenmare (Neidín - The Little Nest)',
        roadName: 'N70 Ring of Kerry Coast',
        speedLimitKmh: 50
      },
      {
        coordinate: { lat: 51.8150, lng: -9.8970 },
        name: 'Staigue Stone Fort (An Stéig - Iron Age Cashel)',
        roadName: 'Ring of Kerry Wild Edge',
        speedLimitKmh: 60
      }
    ]
  }
];
