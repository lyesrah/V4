import React, { useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { useNotificationStore } from '../../store/notificationStore';
import { X, Edit2, Trash2, Phone, Mail, Home, MapPin, Calendar } from 'lucide-react';
import ClientEditField from './ClientEditField';
import DeleteDialog from './DeleteDialog';
import { Client } from '../../store/clientStore';
import { formatDate } from '../../utils/dateUtils';

interface ClientProfileProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export default function ClientProfile({ isOpen, onClose, client }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client>(client);
  const { updateClient, deleteClient } = useClientStore();
  const { addNotification } = useNotificationStore();

  const handleSave = async (field: string, value: any) => {
    try {
      const updates = { [field]: value };
      
      if (field === 'fullName') {
        const [firstName, ...lastNameParts] = value.split(' ');
        updates.firstName = firstName;
        updates.lastName = lastNameParts.join(' ');
        delete updates.fullName;
      }

      setCurrentClient(prev => ({
        ...prev,
        ...updates
      }));

      await updateClient(currentClient.id, updates);

      addNotification({
        title: 'Profile Updated',
        message: 'Client information has been updated successfully',
        type: 'success',
        source: 'system',
        read: false
      });
    } catch (error) {
      setCurrentClient(client);
      
      addNotification({
        title: 'Update Failed',
        message: 'Failed to update client information',
        type: 'error',
        source: 'system',
        read: false
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(currentClient.id);
      
      addNotification({
        title: 'Client Deleted',
        message: `${currentClient.firstName} ${currentClient.lastName} has been deleted`,
        type: 'success',
        source: 'system',
        read: false
      });
      
      onClose();
    } catch (error) {
      addNotification({
        title: 'Deletion Failed',
        message: 'Failed to delete client',
        type: 'error',
        source: 'system',
        read: false
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-xl transform transition-transform duration-300">
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-semibold text-gray-900">Client Profile</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600">
                {currentClient.firstName.charAt(0)}{currentClient.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <ClientEditField
                isEditing={isEditing}
                value={`${currentClient.firstName} ${currentClient.lastName}`}
                onSave={(value) => handleSave('fullName', value)}
                type="text"
                className="text-2xl font-semibold text-gray-900"
              />
              <div className="text-sm text-gray-500 mt-1">
                Client since {formatDate(currentClient.createdAt)}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <ClientEditField
                  isEditing={isEditing}
                  value={currentClient.phone}
                  onSave={(value) => handleSave('phone', value)}
                  type="tel"
                  className="text-gray-900"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <ClientEditField
                  isEditing={isEditing}
                  value={currentClient.email}
                  onSave={(value) => handleSave('email', value)}
                  type="email"
                  className="text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Address</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5 text-gray-400" />
                <ClientEditField
                  isEditing={isEditing}
                  value={currentClient.address}
                  onSave={(value) => handleSave('address', value)}
                  type="text"
                  className="text-gray-900"
                />
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <ClientEditField
                  isEditing={isEditing}
                  value={currentClient.city}
                  onSave={(value) => handleSave('city', value)}
                  type="text"
                  className="text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        clientName={`${currentClient.firstName} ${currentClient.lastName}`}
      />
    </div>
  );
}