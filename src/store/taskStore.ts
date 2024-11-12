import { create } from 'zustand';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { Property } from '../types';

export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed';
export type TaskPriority = 'urgent' | 'medium' | 'normal';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Task {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  recurrence?: TaskRecurrence;
  recurrenceConfig?: {
    frequency: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
    monthOfYear?: number;
  };
  lastGenerated?: Date;
  journeyStepId?: number;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => string;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  getTodaysTasks: () => Task[];
  getInProgressTasks: () => Task[];
  generateRecurringTasks: () => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  addTask: (task) => {
    const id = crypto.randomUUID();
    const newTask = {
      ...task,
      id,
      createdAt: new Date(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    return id;
  },

  updateTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    }));
  },

  getTodaysTasks: () => {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    return get().tasks
      .filter((task) => 
        isWithinInterval(new Date(task.dueDate), { start, end })
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  getInProgressTasks: () => {
    return get().tasks.filter((task) => task.status === 'in_progress');
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  getTaskById: (id) => {
    return get().tasks.find(task => task.id === id);
  },

  generateRecurringTasks: () => {
    const { tasks, addTask } = get();
    const today = new Date();

    tasks.forEach((task) => {
      if (!task.recurrence || !task.recurrenceConfig) return;

      // Handle monthly recurring tasks
      if (task.recurrence === 'monthly') {
        const lastGenerated = task.lastGenerated || task.createdAt;
        const nextDueDate = new Date(task.dueDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        // Check if it's time to generate the next task
        if (nextDueDate > today) return;

        // Create the next recurring task
        addTask({
          ...task,
          dueDate: nextDueDate,
          status: 'not_started',
          lastGenerated: today,
        });
      }
    });
  },
}));

// Run task generation when the store is initialized
useTaskStore.getState().generateRecurringTasks();

// Set up an interval to check for new tasks to generate
setInterval(() => {
  useTaskStore.getState().generateRecurringTasks();
}, 1000 * 60 * 60); // Check every hour