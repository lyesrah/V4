import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import CreateLeadModal from './CreateLeadModal';

export default function CreateLeadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguageStore();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('leads.newLead')}
      </button>

      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}