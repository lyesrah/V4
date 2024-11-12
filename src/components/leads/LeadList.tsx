import React, { useState } from 'react';
import { Lead, LeadRating } from '../../store/leadStore';
import { MoreVertical, Star, AlertTriangle, ThumbsUp, Ban, UserPlus } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import ProspectProfile from '../prospects/ProspectProfile';
import { useLeadStore } from '../../store/leadStore';
import { useClientStore } from '../../store/clientStore';
import { useNotificationStore } from '../../store/notificationStore';

interface LeadListProps {
  leads: Lead[];
}

const getRatingIcon = (rating: LeadRating) => {
  switch (rating) {
    case 'hot':
      return <Star className="w-5 h-5 text-yellow-500" />;
    case 'warm':
      return <ThumbsUp className="w-5 h-5 text-green-500" />;
    case 'cold':
      return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    case 'blocked':
      return <Ban className="w-5 h-5 text-red-500" />;
    default:
      return <Star className="w-5 h-5 text-gray-400" />;
  }
};

export default function LeadList({ leads }: LeadListProps) {
  const { t } = useLanguageStore();
  const { toggleFavorite, deleteLead } = useLeadStore();
  const { addClient } = useClientStore();
  const { addNotification } = useNotificationStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleConvertToClient = async (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Create new client from lead data
      await addClient({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        address: lead.propertyInterest,
        city: '', // You might want to add this to the lead data
      });

      // Delete lead
      await deleteLead(lead.id);

      addNotification({
        title: 'Lead Converted',
        message: `${lead.firstName} ${lead.lastName} has been converted to a client`,
        type: 'success',
        source: 'system',
        read: false
      });
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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">{t('leads.list.title')}</h2>
        </div>
        <div className="divide-y">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              className="p-6 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRatingIcon(lead.rating)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(lead.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <Star className={`w-5 h-5 ${
                      lead.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                    }`} />
                  </button>
                  <button
                    onClick={(e) => handleConvertToClient(lead, e)}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Convert to Client
                  </button>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                    lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t(`leads.status.${lead.status}`)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>{t('leads.list.lastContact')}: {lead.lastContactDate?.toLocaleDateString()}</p>
                {lead.nextFollowUp && (
                  <p>{t('leads.list.nextFollowUp')}: {lead.nextFollowUp.toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedLead && (
        <ProspectProfile
          isOpen={true}
          onClose={() => setSelectedLead(null)}
          lead={selectedLead}
          onUpdate={(updatedLead) => {
            setSelectedLead(updatedLead);
          }}
        />
      )}
    </>
  );
}