import { create } from 'zustand';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  createdAt: Date;
}

interface ClientStore {
  clients: Client[];
  loading: boolean;
  error: string | null;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientCount: () => number;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  addClient: (client) => {
    const newClient = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    set((state) => ({
      clients: [...state.clients, newClient],
    }));
  },

  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },

  getClientCount: () => {
    return get().clients.length;
  },
}));