import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettings {
  theme: 'light' | 'dark';
  firstName: string;
  lastName: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  taskReminders: boolean;
}

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        theme: 'light',
        firstName: '',
        lastName: '',
        emailNotifications: true,
        desktopNotifications: true,
        taskReminders: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'user-settings',
    }
  )
);