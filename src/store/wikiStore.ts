import { create } from 'zustand';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface WikiPage {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface WikiFolder {
  id: string;
  title: string;
  children: (WikiPage | WikiFolder)[];
}

interface WikiStore {
  pages: WikiPage[];
  folders: WikiFolder[];
  loading: boolean;
  error: string | null;
  getPage: (id: string) => WikiPage | null;
  createPage: (page: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WikiPage>;
  updatePage: (id: string, updates: Partial<WikiPage>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  searchPages: (query: string) => WikiPage[];
}

export const useWikiStore = create<WikiStore>((set, get) => ({
  pages: [],
  folders: [],
  loading: false,
  error: null,

  getPage: (id) => {
    const { pages } = get();
    return pages.find(page => page.id === id) || null;
  },

  createPage: async (page) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(collection(db, 'wiki-pages'));
      const newPage = {
        ...page,
        id: docRef.id,
        folderId: page.folderId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(docRef, {
        ...newPage,
        createdAt: newPage.createdAt.toISOString(),
        updatedAt: newPage.updatedAt.toISOString(),
      });

      set(state => ({
        pages: [...state.pages, newPage],
        loading: false,
      }));
      return newPage;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updatePage: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'wiki-pages', id);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, updatedData, { merge: true });
      set(state => ({
        pages: state.pages.map(page =>
          page.id === id ? { ...page, ...updates, updatedAt: new Date() } : page
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deletePage: async (id) => {
    try {
      set({ loading: true, error: null });
      await setDoc(doc(db, 'wiki-pages', id), { deleted: true }, { merge: true });
      set(state => ({
        pages: state.pages.filter(page => page.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  searchPages: (query) => {
    const { pages } = get();
    if (!query) return [];
    
    const normalizedQuery = query.toLowerCase();
    return pages.filter(page =>
      page.title.toLowerCase().includes(normalizedQuery) ||
      page.content.toLowerCase().includes(normalizedQuery)
    );
  },
}));