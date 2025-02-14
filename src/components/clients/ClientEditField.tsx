import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ClientEditFieldProps {
  isEditing: boolean;
  value: string;
  onSave: (value: string) => void;
  type: 'text' | 'email' | 'tel';
  className?: string;
}

export default function ClientEditField({
  isEditing,
  value,
  onSave,
  type,
  className = ''
}: ClientEditFieldProps) {
  const [editValue, setEditValue] = useState(value);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditMode(false);
  };

  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  if (!isEditMode) {
    return (
      <button
        onClick={() => setIsEditMode(true)}
        className={`${className} hover:bg-gray-100 rounded px-2 py-1 -mx-2 transition-colors`}
      >
        {value}
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        autoFocus
      />
      <button
        onClick={handleSave}
        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={handleCancel}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}