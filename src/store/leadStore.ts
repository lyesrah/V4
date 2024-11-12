import { create } from 'zustand';
import { JourneyStep, LEAD_JOURNEY_STEPS } from '../types';
import { useTaskStore } from './taskStore';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
export type LeadRating = 'hot' | 'warm' | 'cold' | 'neutral' | 'blocked';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyInterest: string;
  status: LeadStatus;
  rating: LeadRating;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  score: number;
  formula: string;
  isFavorite: boolean;
  journey: JourneyStep[];
}

interface LeadStore {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'journey'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  completeJourneyStep: (leadId: string, stepId: number) => void;
  getLeadMetrics: () => {
    total: number;
    newLeads: number;
    qualifiedLeads: number;
    conversionRate: number;
    averageScore: number;
    ratingDistribution: Record<LeadRating, number>;
    statusDistribution: Record<LeadStatus, number>;
  };
  toggleFavorite: (id: string) => void;
  getTotalLeads: () => number;
}

const createInitialJourney = (): JourneyStep[] => {
  return LEAD_JOURNEY_STEPS.map((step, index) => ({
    ...step,
    status: index === 0 ? 'in_progress' : 'pending',
    dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000) // Due date is current date + (step position * 1 day)
  }));
};

const createTaskForStep = (lead: Lead, step: JourneyStep) => {
  const { addTask } = useTaskStore.getState();
  const task = {
    propertyId: lead.propertyInterest,
    title: step.title,
    description: `${step.description} pour ${lead.firstName} ${lead.lastName}`,
    dueDate: step.dueDate || new Date(),
    status: 'not_started',
    priority: 'normal',
    journeyStepId: step.id
  };
  
  return addTask(task);
};

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  loading: false,
  error: null,

  addLead: (lead) => {
    const journey = createInitialJourney();
    const newLead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      journey,
      isFavorite: false,
    };

    // Create task for first step
    const taskId = createTaskForStep(newLead, journey[0]);
    journey[0].taskId = taskId;

    set((state) => ({
      leads: [...state.leads, newLead],
    }));
  },

  updateLead: (id, updates) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates, updatedAt: new Date() }
          : lead
      ),
    }));
  },

  deleteLead: (id) => {
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id),
    }));
  },

  completeJourneyStep: (leadId: string, stepId: number) => {
    set((state) => ({
      leads: state.leads.map((lead) => {
        if (lead.id !== leadId) return lead;

        const updatedJourney = lead.journey.map((step, index) => {
          if (step.id !== stepId) return step;

          // Complete current step
          const completedStep = {
            ...step,
            status: 'completed' as const,
            completedAt: new Date()
          };

          // Start next step if available
          if (index < lead.journey.length - 1) {
            const nextStep = lead.journey[index + 1];
            const taskId = createTaskForStep(lead, nextStep);
            lead.journey[index + 1] = {
              ...nextStep,
              status: 'in_progress',
              taskId
            };
          }

          return completedStep;
        });

        return {
          ...lead,
          journey: updatedJourney,
          updatedAt: new Date()
        };
      })
    }));
  },

  getLeadMetrics: () => {
    const { leads } = get();
    const total = leads.length;
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
    const closedLeads = leads.filter((l) => l.status === 'closed').length;
    
    const ratingDistribution = leads.reduce((acc, lead) => {
      acc[lead.rating] = (acc[lead.rating] || 0) + 1;
      return acc;
    }, {} as Record<LeadRating, number>);

    const statusDistribution = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<LeadStatus, number>);

    return {
      total,
      newLeads,
      qualifiedLeads,
      conversionRate: total ? (closedLeads / total) * 100 : 0,
      averageScore: leads.reduce((acc, lead) => acc + lead.score, 0) / total || 0,
      ratingDistribution,
      statusDistribution,
    };
  },

  toggleFavorite: (id) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id
          ? { ...lead, isFavorite: !lead.isFavorite }
          : lead
      ),
    }));
  },

  getTotalLeads: () => {
    return get().leads.length;
  },
}));