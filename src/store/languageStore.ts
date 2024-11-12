import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'fr' | 'en' | 'es' | 'it';

interface LanguageStore {
  currentLanguage: Language;
  translations: Record<string, Record<Language, string>>;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const defaultTranslations: Record<string, Record<Language, string>> = {
  // Dashboard Translations
  'dashboard.greeting': {
    fr: 'Bonjour',
    en: 'Hello',
    es: 'Hola',
    it: 'Ciao'
  },
  'dashboard.subtitle': {
    fr: 'Voici un aperçu de votre activité',
    en: 'Here\'s an overview of your activity',
    es: 'Aquí tiene una visión general de su actividad',
    it: 'Ecco una panoramica della tua attività'
  },
  'dashboard.properties': {
    fr: 'Propriétés',
    en: 'Properties',
    es: 'Propiedades',
    it: 'Proprietà'
  },
  'dashboard.totalClients': {
    fr: 'Total Clients',
    en: 'Total Clients',
    es: 'Total Clientes',
    it: 'Totale Clienti'
  },
  'dashboard.todaysTasks': {
    fr: 'Tâches du jour',
    en: 'Today\'s Tasks',
    es: 'Tareas de hoy',
    it: 'Attività di oggi'
  },
  'dashboard.tasksInProgress': {
    fr: 'Tâches en cours',
    en: 'Tasks in Progress',
    es: 'Tareas en progreso',
    it: 'Attività in corso'
  },
  'dashboard.viewAll': {
    fr: 'Voir tout',
    en: 'View all',
    es: 'Ver todo',
    it: 'Vedi tutto'
  },
  'dashboard.recentActivity': {
    fr: 'Activité récente',
    en: 'Recent Activity',
    es: 'Actividad reciente',
    it: 'Attività recente'
  },
  'dashboard.noTasks': {
    fr: 'Aucune tâche pour aujourd\'hui',
    en: 'No tasks for today',
    es: 'No hay tareas para hoy',
    it: 'Nessuna attività per oggi'
  },

  // Lead Page Translations
  'leads.title': {
    fr: 'Gestion des prospects',
    en: 'Lead Management',
    es: 'Gestión de prospectos',
    it: 'Gestione dei lead'
  },
  // ... (rest of the translations remain the same)
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'fr',
      translations: defaultTranslations,
      setLanguage: (language) => set({ currentLanguage: language }),
      t: (key: string) => {
        const { translations, currentLanguage } = get();
        return translations[key]?.[currentLanguage] || key;
      }
    }),
    {
      name: 'language-store'
    }
  )
);