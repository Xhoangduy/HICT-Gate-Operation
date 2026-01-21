import { Lane, LaneStatus, TransactionData } from './types';

// --- LANE 02 IMAGES (OLD SET) ---
const IMG_L02_PANORAMA = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768962138/z7452131383618_5ace9091ab24563d0195eb8e829890ac_ryxv7x.jpg"; 
const IMG_L02_FRONT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911949/2c8a1e5e-2cd8-4387-83f9-69044efe2803_s3f0xr.jpg"; 
const IMG_L02_BACK = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911939/18608947-a1ed-4a7d-a0c5-8c9a477f483d_dsub4r.jpg"; 
const IMG_L02_TOP = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911958/64fdf52e-5e3f-46f5-ace9-7ee44598e20d_cwww2r.jpg"; 
const IMG_L02_LEFT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911958/a2d47dec-871d-46dd-b892-1a03fe0baff9_r2p7ax.jpg"; 
const IMG_L02_RIGHT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768911933/ff1e831e-f830-45a8-a8bb-eee152daa8f3_fuylf3.jpg"; 

// --- LANE 03 IMAGES (NEW SET) ---
const IMG_L03_PANORAMA = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768969934/97bf8fe8-f1a8-4270-ab41-cef9cffd6ba8_c30chi.jpg";
const IMG_L03_FRONT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768969934/37117cf3-d376-4467-8301-9914171af68e_izbqp8.jpg";
const IMG_L03_BACK = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768969907/db889cd9-d559-49c2-ac65-c91d27461b5a_u3mufh.jpg";
const IMG_L03_TOP = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768969934/69ac52ca-e370-48fb-a080-d6f4f45050a3_ocs3me.jpg";
const IMG_L03_LEFT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768969934/95b534ec-d4de-4213-a9e2-7f31e963f917_qcfol9.jpg";
const IMG_L03_RIGHT = "https://res.cloudinary.com/ditrwpwyv/image/upload/v1768969935/0f73838b-93ce-42c6-8c52-cc683ee36ef5_gezrbi.jpg";


export const MOCK_LANES: Lane[] = [
  { id: 'L01', name: 'Cổng vào 1', type: 'Inbound', status: LaneStatus.Idle, lastUpdated: '00:00:00' },
  { id: 'L02', name: 'Cổng vào 2', type: 'Inbound', status: LaneStatus.Waiting, currentTruck: '51L-88941', duration: '30s', lastUpdated: '00:30:15' },
  { id: 'L03', name: 'Cổng vào 3', type: 'Inbound', status: LaneStatus.Waiting, currentTruck: '30C-22432', containerNo: 'TGBU3719401', duration: '15s', lastUpdated: '01:43:22' },
  { id: 'L04', name: 'Cổng ra 4', type: 'Outbound', status: LaneStatus.Failed, currentTruck: '30C-42421', containerNo: 'MSKU123456', duration: '120s', lastUpdated: '03:14:10' },
  { id: 'L05', name: 'Cổng ra 5', type: 'Outbound', status: LaneStatus.Failed, currentTruck: '30C-57145', containerNo: 'PONU987654', duration: '45s', lastUpdated: '05:07:33' },
  { id: 'L06', name: 'Cổng ra 6', type: 'Outbound', status: LaneStatus.Waiting, currentTruck: '30C-24468', duration: '10s', lastUpdated: '00:17:45' },
  { id: 'L07', name: 'Cổng ra 7', type: 'Outbound', status: LaneStatus.Success, currentTruck: '29H-11223', containerNo: 'MAEU998877', duration: '25s', lastUpdated: '00:15:20' },
];

// Transaction Data for Lane 2
const DATA_L02: TransactionData = {
  id: 'TRX-2025-L02',
  sessionId: 'SMG211020250002',
  timestamp: '21/10/2025 13:21:44',
  laneId: 'L02',
  status: LaneStatus.Waiting,
  images: {
    panorama: IMG_L02_PANORAMA,
    front: IMG_L02_FRONT,
    back: IMG_L02_BACK,
    left: IMG_L02_LEFT,
    right: IMG_L02_RIGHT,
    top: IMG_L02_TOP,
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
  notes: 'Container có dán Tem nguy hiểm',
};

// Transaction Data for Lane 3
const DATA_L03: TransactionData = {
  id: 'TRX-2025-L03',
  sessionId: 'SMG211020250003',
  timestamp: '21/10/2025 13:45:10',
  laneId: 'L03',
  status: LaneStatus.Waiting,
  images: {
    panorama: IMG_L03_PANORAMA,
    front: IMG_L03_FRONT,
    back: IMG_L03_BACK,
    left: IMG_L03_LEFT,
    right: IMG_L03_RIGHT,
    top: IMG_L03_TOP,
  },
  ocrData: {
    containerNo: 'TGBU3719401',
    isoCode: '45G1',
    truckPlate: '30C-22432',
    trailerPlate: '15R-24425', 
    sealNo: 'DS42505',
  },
  systemData: {
    containerNo: 'TGBU3719401',
    isoCode: '45G1',
    truckPlate: '30C-22432',
    trailerPlate: '15R-24425',
    sealNo: 'DS42505',
    vgm: '28,500',
    bookingNo: 'SMG211025-001',
    eir: 'EIR-8821',
  },
  notes: 'Container có dấu hiệu móp nhẹ vách trái',
};

// Map lane IDs to specific data
export const MOCK_TRANSACTIONS_BY_LANE: Record<string, TransactionData> = {
    'L02': DATA_L02,
    'L03': DATA_L03,
};

// Default export for initial load (defaulting to L03 as requested context)
export const MOCK_TRANSACTION = DATA_L03;