export interface HouseRules {
  icon: string;
  rule: string;
  description: string;
}

export interface CheckInOutRules {
  icon: string;
  title: string;
  time: string;
  description: string;
}

export interface Property {
  name: string;
  address: string;
  type: string;
  surface: number;
  floor: number;
  door: string;
  deposit: number;
  elevator: boolean;
  furnished: boolean;
  wifiName: string;
  wifiPassword: string;
  keys: {
    total: number;
    images: string[];
    lockSystem: string;
  };
  cleaning: {
    mop: boolean;
    broom: boolean;
    dustpan: boolean;
    vacuum: boolean;
  };
  transportation: {
    nearestAirport: string;
    trainStation: string;
    parkingAccess: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}
