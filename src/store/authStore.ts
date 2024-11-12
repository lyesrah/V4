import { create } from 'zustand';

interface AuthState {
  loading: boolean;
  error: string | null;
}

export const useAuthStore = create<AuthState>(() => ({
  loading: false,
  error: null,
}));