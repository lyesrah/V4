import { create } from 'zustand';
import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Property } from '../types';

interface PropertyState {
  properties: (Property & { id: string })[];
  loading: boolean;
  error: string | null;
  fetchUserProperties: (userId: string) => Promise<void>;
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  loading: false,
  error: null,

  fetchUserProperties: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const q = query(collection(db, 'properties'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (Property & { id: string })[];
      set({ properties });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addProperty: async (property) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'properties'), property);
      const newProperty = { ...property, id: docRef.id } as Property & { id: string };
      set(state => ({ 
        properties: [...state.properties, newProperty],
        loading: false 
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateProperty: async (id: string, property: Partial<Property>) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, property);
      set(state => ({
        properties: state.properties.map(p => 
          p.id === id ? { ...p, ...property } : p
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteProperty: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'properties', id));
      set(state => ({
        properties: state.properties.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));