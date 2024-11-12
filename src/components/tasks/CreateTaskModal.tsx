import React, { useState } from 'react';
import { X, Clock, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTaskStore, TaskStatus, TaskPriority, TaskRecurrence } from '../../store/taskStore';
import { Property } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { format } from 'date-fns';

// ... (previous imports remain the same)

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  initialClientId?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  properties,
  initialClientId,
}: CreateTaskModalProps) {
  const { currentLanguage: lang } = useLanguageStore();
  const [propertyId, setPropertyId] = useState(initialClientId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('09:00');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  const { addTask } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dueDatetime = new Date(`${dueDate}T${dueTime}`);
    
    const recurrenceConfig = recurrence === 'monthly' ? {
      frequency: 1,
      dayOfWeek: 1, // Monday
    } : undefined;

    addTask({
      propertyId,
      title,
      description,
      dueDate: dueDatetime,
      status,
      priority,
      recurrence,
      recurrenceConfig,
    });
    
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setPropertyId(initialClientId || '');
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('09:00');
    setStatus('not_started');
    setPriority('normal');
    setRecurrence('none');
  };

  // ... (previous helper functions remain the same)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* ... (previous header remains the same) */}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* ... (previous form fields remain the same) */}

          {/* New Recurrence Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'fr' ? 'Récurrence' :
               lang === 'es' ? 'Recurrencia' :
               lang === 'it' ? 'Ricorrenza' :
               'Recurrence'}
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="none">
                  {lang === 'fr' ? 'Aucune' :
                   lang === 'es' ? 'Ninguna' :
                   lang === 'it' ? 'Nessuna' :
                   'None'}
                </option>
                <option value="monthly">
                  {lang === 'fr' ? 'Mensuelle' :
                   lang === 'es' ? 'Mensual' :
                   lang === 'it' ? 'Mensile' :
                   'Monthly'}
                </option>
              </select>
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </div>
            {recurrence === 'monthly' && (
              <p className="mt-1 text-sm text-gray-500">
                {lang === 'fr' ? 'Se répète le premier lundi de chaque mois' :
                 lang === 'es' ? 'Se repite el primer lunes de cada mes' :
                 lang === 'it' ? 'Si ripete il primo lunedì di ogni mese' :
                 'Repeats on the first Monday of every month'}
              </p>
            )}
          </div>

          {/* ... (previous form buttons remain the same) */}
        </form>
      </div>
    </div>
  );
}