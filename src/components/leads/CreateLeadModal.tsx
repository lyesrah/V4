import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLeadStore } from '../../store/leadStore';
import { useLanguageStore } from '../../store/languageStore';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateLeadModal({ isOpen, onClose }: CreateLeadModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { addLead } = useLeadStore();
  const { t } = useLanguageStore();

  const steps = [
    {
      title: t('leads.form.personalInfo'),
      fields: [
        { id: 'firstName', label: t('leads.form.firstName'), type: 'text', required: true },
        { id: 'lastName', label: t('leads.form.lastName'), type: 'text', required: true },
        { id: 'email', label: t('leads.form.email'), type: 'email', required: true },
        { id: 'phone', label: t('leads.form.phone'), type: 'tel', required: true }
      ]
    },
    {
      title: t('leads.form.propertyDetails'),
      fields: [
        { id: 'address', label: t('leads.form.address'), type: 'text', required: true },
        {
          id: 'propertyType',
          label: t('leads.form.propertyType'),
          type: 'select',
          options: ['Apartment', 'House', 'Villa', 'Studio'],
          required: true
        },
        {
          id: 'formula',
          label: t('leads.form.formula'),
          type: 'select',
          options: ['Support + Cleaning Formula', 'Support Only Formula'],
          required: true
        }
      ]
    },
    {
      title: t('leads.form.additionalInfo'),
      fields: [
        {
          id: 'status',
          label: t('leads.form.status'),
          type: 'select',
          options: ['hot', 'warm', 'cold'],
          required: true
        },
        { id: 'notes', label: t('leads.form.notes'), type: 'textarea', required: false }
      ]
    }
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    addLead({
      ...formData,
      rating: 'neutral',
      status: formData.status || 'new',
      score: 0
    });
    onClose();
    setCurrentStep(0);
    setFormData({});
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStepData.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-6">
            {currentStepData.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required={field.required}
                  >
                    <option value="">{t('leads.form.select')}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('leads.form.previous')}
          </button>
          <button
            onClick={handleNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? (
              t('leads.form.create')
            ) : (
              <>
                {t('leads.form.next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}