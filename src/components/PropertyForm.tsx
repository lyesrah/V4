import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyFormField } from '../types';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty } = usePropertyStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const formFields: PropertyFormField[] = [
    {
      id: 'name',
      question: 'Quel est le nom de la propriété ?',
      type: 'text',
      value: '',
      required: true
    },
    {
      id: 'type',
      question: 'Quel est le type de bien ?',
      type: 'select',
      options: ['Appartement', 'Maison', 'Studio', 'Loft'],
      value: '',
      required: true
    },
    {
      id: 'surface',
      question: 'Quelle est la surface en m² ?',
      type: 'number',
      value: 0,
      required: true
    },
    {
      id: 'address',
      question: 'Quelle est l\'adresse complète ?',
      type: 'text',
      value: '',
      required: true
    },
    {
      id: 'floor',
      question: 'À quel étage se situe le bien ?',
      type: 'number',
      value: 0,
      required: true
    },
    {
      id: 'elevator',
      question: 'Y a-t-il un ascenseur ?',
      type: 'checkbox',
      value: false
    },
    {
      id: 'furnished',
      question: 'Le bien est-il meublé ?',
      type: 'checkbox',
      value: false
    }
  ];

  const isEditMode = Boolean(id);
  const currentField = formFields[currentStep];
  const progress = ((currentStep + 1) / formFields.length) * 100;

  useEffect(() => {
    if (isEditMode) {
      const property = properties.find(p => p.id === id);
      if (property) {
        setFormData({
          name: property.name,
          type: property.type,
          surface: property.surface,
          address: property.address,
          floor: property.floor,
          elevator: property.elevator,
          furnished: property.furnished
        });
      }
    }
  }, [id, properties, isEditMode]);

  const handleSubmit = async () => {
    try {
      const requiredFields = formFields.filter(field => field.required).map(field => field.id);
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (isEditMode) {
        await updateProperty(id!, formData);
      } else {
        await addProperty(formData);
      }
      
      navigate('/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleNext = async () => {
    if (currentStep < formFields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-12">
        <Building2 className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? 'Modifier la propriété' : 'Nouvelle propriété'}
        </h1>
      </div>

      <div className="w-full h-1 bg-gray-200 rounded-full mb-12">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-6">
          {currentField.question}
        </h2>

        {currentField.type === 'select' ? (
          <select
            value={formData[currentField.id] || ''}
            onChange={(e) => setFormData({ ...formData, [currentField.id]: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          >
            <option value="">Sélectionner...</option>
            {currentField.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : currentField.type === 'checkbox' ? (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData[currentField.id] || false}
              onChange={(e) => setFormData({ ...formData, [currentField.id]: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Oui</span>
          </label>
        ) : (
          <input
            type={currentField.type}
            value={formData[currentField.id] || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              [currentField.id]: currentField.type === 'number' 
                ? parseFloat(e.target.value) 
                : e.target.value 
            })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            required={currentField.required}
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition ${
            currentStep === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Précédent</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span>
            {currentStep === formFields.length - 1 ? (
              isEditMode ? 'Mettre à jour' : 'Créer'
            ) : (
              'Suivant'
            )}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}