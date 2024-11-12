import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClientStore } from '../store/clientStore';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface FormField {
  id: keyof Omit<Client, 'id' | 'createdAt'>;
  question: string;
  type: 'text' | 'tel' | 'email';
  placeholder: string;
  required?: boolean;
}

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, addClient, updateClient } = useClientStore();
  const { currentLanguage: lang } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      firstName: {
        en: "What is the client's first name?",
        fr: "Quel est le prénom du client ?",
        es: "¿Cuál es el nombre del cliente?",
        it: "Qual è il nome del cliente?"
      },
      lastName: {
        en: "What is the client's last name?",
        fr: "Quel est le nom de famille du client ?",
        es: "¿Cuál es el apellido del cliente?",
        it: "Qual è il cognome del cliente?"
      },
      email: {
        en: "What is the client's email address?",
        fr: "Quelle est l'adresse email du client ?",
        es: "¿Cuál es el correo electrónico del cliente?",
        it: "Qual è l'indirizzo email del cliente?"
      },
      address: {
        en: "What is the client's address?",
        fr: "Quelle est l'adresse du client ?",
        es: "¿Cuál es la dirección del cliente?",
        it: "Qual è l'indirizzo del cliente?"
      },
      city: {
        en: "In which city does the client live?",
        fr: "Dans quelle ville habite le client ?",
        es: "¿En qué ciudad vive el cliente?",
        it: "In quale città vive il cliente?"
      },
      phone: {
        en: "What is the client's phone number?",
        fr: "Quel est le numéro de téléphone du client ?",
        es: "¿Cuál es el número de teléfono del cliente?",
        it: "Qual è il numero di telefono del cliente?"
      }
    };
    return translations[key][lang] || translations[key].en;
  };

  const formFields: FormField[] = [
    {
      id: 'firstName',
      question: getTranslation('firstName'),
      type: 'text',
      placeholder: 'John',
      required: true
    },
    {
      id: 'lastName',
      question: getTranslation('lastName'),
      type: 'text',
      placeholder: 'Doe',
      required: true
    },
    {
      id: 'email',
      question: getTranslation('email'),
      type: 'email',
      placeholder: 'john.doe@example.com',
      required: true
    },
    {
      id: 'address',
      question: getTranslation('address'),
      type: 'text',
      placeholder: '123 Main Street',
      required: true
    },
    {
      id: 'city',
      question: getTranslation('city'),
      type: 'text',
      placeholder: 'Paris',
      required: true
    },
    {
      id: 'phone',
      question: getTranslation('phone'),
      type: 'tel',
      placeholder: '+33 1 23 45 67 89',
      required: true
    }
  ];

  const isEditMode = Boolean(id);
  const currentField = formFields[currentStep];
  const progress = ((currentStep + 1) / formFields.length) * 100;

  useEffect(() => {
    if (isEditMode) {
      const client = clients.find(c => c.id === id);
      if (client) {
        setFormData({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          address: client.address,
          city: client.city,
          phone: client.phone
        });
      }
    }
  }, [id, clients, isEditMode]);

  const handleSubmit = async () => {
    try {
      const requiredFields = formFields.filter(field => field.required).map(field => field.id);
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(
          lang === 'fr' ? "Veuillez remplir tous les champs obligatoires" :
          lang === 'es' ? "Por favor complete todos los campos requeridos" :
          lang === 'it' ? "Si prega di compilare tutti i campi obbligatori" :
          "Please fill in all required fields"
        );
      }

      if (isEditMode) {
        await updateClient(id!, formData);
      } else {
        await addClient(formData);
      }
      
      navigate('/clients');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? (
            lang === 'fr' ? 'Modifier le client' :
            lang === 'es' ? 'Editar cliente' :
            lang === 'it' ? 'Modifica cliente' :
            'Edit Client'
          ) : (
            lang === 'fr' ? 'Nouveau client' :
            lang === 'es' ? 'Nuevo cliente' :
            lang === 'it' ? 'Nuovo cliente' :
            'New Client'
          )}
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

        <input
          type={currentField.type}
          value={formData[currentField.id] || ''}
          onChange={(e) => setFormData({
            ...formData,
            [currentField.id]: e.target.value
          })}
          placeholder={currentField.placeholder}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          required={currentField.required}
        />
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
          <span>
            {lang === 'fr' ? 'Précédent' :
             lang === 'es' ? 'Anterior' :
             lang === 'it' ? 'Precedente' :
             'Previous'}
          </span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span>
            {currentStep === formFields.length - 1 ? (
              isEditMode ? (
                lang === 'fr' ? 'Mettre à jour' :
                lang === 'es' ? 'Actualizar' :
                lang === 'it' ? 'Aggiorna' :
                'Update'
              ) : (
                lang === 'fr' ? 'Créer' :
                lang === 'es' ? 'Crear' :
                lang === 'it' ? 'Crea' :
                'Create'
              )
            ) : (
              lang === 'fr' ? 'Suivant' :
              lang === 'es' ? 'Siguiente' :
              lang === 'it' ? 'Successivo' :
              'Next'
            )}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}