import { Lane, LaneStatus, TransactionData } from './types';

// Realistic Container Images - Inspection Quality
// Panorama: Full side view of container on truck
const IMG_PANORAMA = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911958/f74266da-2c1c-401c-b439-77262f42eb98_pel7hn.jpg"; 

// Front: Container Doors (Direct view showing ID & Locks)
const IMG_FRONT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911949/2c8a1e5e-2cd8-4387-83f9-69044efe2803_s3f0xr.jpg"; 

// Back: Rear view (Showing full door structure / alternative angle)
const IMG_BACK = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911939/18608947-a1ed-4a7d-a0c5-8c9a477f483d_dsub4r.jpg"; 

// Top: Roof view (Aerial/Drone shot)
const IMG_TOP = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911958/64fdf52e-5e3f-46f5-ace9-7ee44598e20d_cwww2r.jpg"; 

// Left Side: Full side wall (showing condition)
const IMG_LEFT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911958/a2d47dec-871d-46dd-b892-1a03fe0baff9_r2p7ax.jpg"; 

// Right Side: Full side wall (showing condition)
const IMG_RIGHT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911933/ff1e831e-f830-45a8-a8bb-eee152daa8f3_fuylf3.jpg"; 

export const MOCK_LANES: Lane[] = [
  { id: 'L01', name: 'Cổng vào 1', type: 'Inbound', status: LaneStatus.Idle, lastUpdated: '00:00:00' },
  { id: 'L02', name: 'Cổng vào 2', type: 'Inbound', status: LaneStatus.Waiting, currentTruck: '51L-88941', duration: '30s', lastUpdated: '00:30:15' },
  { id: 'L03', name: 'Cổng vào 3', type: 'Inbound', status: LaneStatus.Failed, currentTruck: '30C-22432', containerNo: 'TGBU3719401', duration: '15s', lastUpdated: '01:43:22' },
  { id: 'L04', name: 'Cổng ra 4', type: 'Outbound', status: LaneStatus.Failed, currentTruck: '30C-42421', containerNo: 'MSKU123456', duration: '120s', lastUpdated: '03:14:10' },
  { id: 'L05', name: 'Cổng ra 5', type: 'Outbound', status: LaneStatus.Failed, currentTruck: '30C-57145', containerNo: 'PONU987654', duration: '45s', lastUpdated: '05:07:33' },
  { id: 'L06', name: 'Cổng ra 6', type: 'Outbound', status: LaneStatus.Waiting, currentTruck: '30C-24468', duration: '10s', lastUpdated: '00:17:45' },
  { id: 'L07', name: 'Cổng ra 7', type: 'Outbound', status: LaneStatus.Success, currentTruck: '29H-11223', containerNo: 'MAEU998877', duration: '25s', lastUpdated: '00:15:20' },
];

export const MOCK_TRANSACTION: TransactionData = {
  id: 'TRX-2025-001',
  sessionId: 'SMG211020250001',
  timestamp: '21/10/2025 13:21:44',
  laneId: 'L02',
  status: LaneStatus.Waiting,
  images: {
    panorama: IMG_PANORAMA,
    front: IMG_FRONT,
    back: IMG_BACK,
    left: IMG_LEFT,
    right: IMG_RIGHT,
    top: IMG_TOP,
  },
  ocrData: {
    containerNo: 'MAGU5327080',
    isoCode: '45G1',
    truckPlate: '51L-88941',
    trailerPlate: '15R-24425', 
    sealNo: 'DS42505',
  },
  systemData: {
    containerNo: 'MAGU5327080',
    isoCode: '45G1',
    truckPlate: '51L-88941',
    trailerPlate: '15R-24425',
    sealNo: 'DS42505',
    vgm: '28,500',
    bookingNo: 'SMG211025-001',
    eir: 'EIR-8821',
  },
  notes: 'Container chưa được giám định',
};