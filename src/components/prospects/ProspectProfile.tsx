import React, { useState } from 'react';
import { useLeadStore } from '../../store/leadStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useClientStore } from '../../store/clientStore';
import { X, Edit2, UserPlus, Phone, Mail, Star, Calendar, MapPin } from 'lucide-react';
import ProspectEditField from './ProspectEditField';
import { Lead } from '../../store/leadStore';
import { formatDate } from '../../utils/dateUtils';
import LeadJourney from '../leads/LeadJourney';

interface ProspectProfileProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onUpdate: (updatedLead: Lead) => void;
}

export default function ProspectProfile({ isOpen, onClose, lead, onUpdate }: ProspectProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead>(lead);
  const { updateLead, completeJourneyStep, toggleFavorite } = useLeadStore();
  const { addClient } = useClientStore();
  const { addNotification } = useNotificationStore();

  const handleSave = async (field: string, value: any) => {
    try {
      const updates = { [field]: value };
      const updatedLead = {
        ...currentLead,
        ...updates,
        updatedAt: new Date()
      };
      
      setCurrentLead(updatedLead);
      onUpdate(updatedLead);
      await updateLead(currentLead.id, updates);

      addNotification({
        title: 'Profile Updated',
        message: 'Lead information has been updated successfully',
        type: 'success',
        source: 'system',
        read: false
      });
    } catch (error) {
      setCurrentLead(lead);
      
      addNotification({
        title: 'Update Failed',
        message: 'Failed to update lead information',
        type: 'error',
        source: 'system',
        read: false
      });
    }
  };

  const handleJourneyStepComplete = async (stepId: number) => {
    await completeJourneyStep(currentLead.id, stepId);
    const updatedLead = {
      ...currentLead,
      journey: currentLead.journey.map((step) => {
        if (step.id === stepId) {
          return { ...step, status: 'completed' as const, completedAt: new Date() };
        } else if (step.id === stepId + 1) {
          return { ...step, status: 'in_progress' as const };
        }
        return step;
      })
    };
    setCurrentLead(updatedLead);
    onUpdate(updatedLead);
  };

  const handleConvertToClient = async () => {
    try {
      await addClient({
        firstName: currentLead.firstName,
        lastName: currentLead.lastName,
        email: currentLead.email,
        phone: currentLead.phone,
        address: currentLead.propertyInterest,
        city: '',
      });

      addNotification({
        title: 'Lead Converted',
        message: `${currentLead.firstName} ${currentLead.lastName} has been converted to a client`,
        type: 'success',
        source: 'system',
        read: false
      });

      onClose();
    } catch (error) {
      addNotification({
        title: 'Conversion Failed',
        message: 'Failed to convert lead to client',
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
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-semibold text-gray-900">Lead Profile</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleFavorite(currentLead.id)}
                className="p-2 text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
              >
                <Star className={`w-5 h-5 ${currentLead.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Edit2 className="w-5 h-5" />
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
          {/* Basic Information */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600">
                {currentLead.firstName.charAt(0)}{currentLead.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <ProspectEditField
                isEditing={isEditing}
                value={`${currentLead.firstName} ${currentLead.lastName}`}
                onSave={(value) => {
                  const [firstName, ...lastNameParts] = value.split(' ');
                  handleSave('firstName', firstName);
                  handleSave('lastName', lastNameParts.join(' '));
                }}
                type="text"
                className="text-2xl font-semibold text-gray-900"
              />
              <div className="text-sm text-gray-500 mt-1">
                Lead since {formatDate(currentLead.createdAt)}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <ProspectEditField
                  isEditing={isEditing}
                  value={currentLead.phone}
                  onSave={(value) => handleSave('phone', value)}
                  type="tel"
                  className="text-gray-900"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <ProspectEditField
                  isEditing={isEditing}
                  value={currentLead.email}
                  onSave={(value) => handleSave('email', value)}
                  type="email"
                  className="text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Property Interest */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Property Interest</h3>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <ProspectEditField
                isEditing={isEditing}
                value={currentLead.propertyInterest}
                onSave={(value) => handleSave('propertyInterest', value)}
                type="text"
                className="text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">Formula: {currentLead.formula}</span>
            </div>
          </div>

          {/* Journey Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <LeadJourney
              steps={currentLead.journey}
              onComplete={handleJourneyStepComplete}
            />
          </div>

          {/* Convert to Client Button */}
          <div className="flex justify-center">
            <button
              onClick={handleConvertToClient}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Convert to Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}