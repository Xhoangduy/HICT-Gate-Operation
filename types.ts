export enum LaneStatus {
  Processing = 'Processing',
  Success = 'Success',
  Failed = 'Failed',
  Waiting = 'Waiting',
  Idle = 'Idle'
}

export interface Lane {
  id: string;
  name: string;
  type: 'Inbound' | 'Outbound';
  status: LaneStatus;
  currentTruck?: string;
  containerNo?: string;
  duration?: string; // in seconds
  lastUpdated: string;
}

export interface TransactionData {
  id: string;
  sessionId: string;
  timestamp: string;
  laneId: string;
  status: LaneStatus;
  images: {
    panorama: string;
    front: string;
    back: string;
    left: string;
    right: string;
    top: string;
  };
  ocrData: {
    containerNo: string;
    isoCode: string;
    truckPlate: string;
    trailerPlate: string;
    sealNo: string;
  };
  systemData: {
    containerNo: string;
    isoCode: string;
    truckPlate: string;
    trailerPlate: string;
    sealNo: string;
    vgm: string;
    bookingNo: string;
    eir: string;
  };
  notes: string;
}

export interface DashboardStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}