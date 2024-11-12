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

export type JourneyStepStatus = 'pending' | 'in_progress' | 'completed';

export interface JourneyStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: JourneyStepStatus;
  completedAt?: Date;
  dueDate?: Date;
  taskId?: string;
}

export const LEAD_JOURNEY_STEPS: Omit<JourneyStep, 'status' | 'completedAt' | 'dueDate' | 'taskId'>[] = [
  {
    id: 1,
    title: 'Premier contact',
    description: 'Premier contact par message',
    icon: 'MessageSquare'
  },
  {
    id: 2,
    title: 'Contact téléphonique',
    description: 'Deuxième contact par téléphone',
    icon: 'Phone'
  },
  {
    id: 3,
    title: 'Rendez-vous physique',
    description: 'Rencontre en personne avec le prospect',
    icon: 'Users'
  },
  {
    id: 4,
    title: 'Préparation contrat',
    description: 'Préparer et envoyer le contrat',
    icon: 'FileText'
  },
  {
    id: 5,
    title: 'Photographe',
    description: 'Prise de rendez-vous avec le photographe',
    icon: 'Camera'
  },
  {
    id: 6,
    title: 'Formulaire client',
    description: 'Envoi du formulaire au client',
    icon: 'ClipboardCheck'
  }
];