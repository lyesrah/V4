import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConvertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  prospectName: string;
}

export default function ConvertDialog({
  isOpen,
  onClose,
  onConfirm,
  prospectName
}: ConvertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Convert to Client
        </h3>
        
        <p className="text-gray-500 text-center mb-6">
          Are you sure you want to convert <span className="font-medium text-gray-900">{prospectName}</span> to a client? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
}