import React from 'react';
import { MessageSquare, Phone, Users, FileText, Camera, ClipboardCheck, Check } from 'lucide-react';
import { JourneyStep } from '../../types/journey';
import { AnimatePresence, motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';

interface LeadJourneyProps {
  steps: JourneyStep[];
  onComplete: (stepId: number) => void;
}

const icons = {
  MessageSquare,
  Phone,
  Users,
  FileText,
  Camera,
  ClipboardCheck
};

export default function LeadJourney({ steps, onComplete }: LeadJourneyProps) {
  const { updateTaskStatus } = useTaskStore();

  const handleComplete = async (stepId: number) => {
    // Find the step
    const step = steps.find(s => s.id === stepId);
    
    // If the step has an associated task, update its status
    if (step?.taskId) {
      await updateTaskStatus(step.taskId, 'completed');
    }
    
    // Call the original onComplete handler
    onComplete(stepId);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium text-gray-900">Parcours du prospect</h3>
      
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full 
                  ${step.status === 'completed' 
                    ? 'bg-green-100' 
                    : step.status === 'in_progress'
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {step.status === 'completed' ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-6 h-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {React.createElement(icons[step.icon as keyof typeof icons], {
                        className: `w-6 h-6 ${
                          step.status === 'in_progress' ? 'text-blue-600' : 'text-gray-400'
                        }`
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="ml-4 flex-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    step.status === 'completed' 
                      ? 'text-green-600 line-through' 
                      : step.status === 'in_progress'
                      ? 'text-blue-600'
                      : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h4>
                  {step.status === 'in_progress' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleComplete(step.id)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Marquer comme terminé
                    </motion.button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                {step.dueDate && (
                  <p className="mt-1 text-sm text-gray-400">
                    Date prévue : {step.dueDate.toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}