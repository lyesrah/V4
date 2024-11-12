import React from 'react';
import { Lead } from '../../store/leadStore';
import { Calendar, Clock } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface LeadCalendarProps {
  leads: Lead[];
}

export default function LeadCalendar({ leads }: LeadCalendarProps) {
  const { t } = useLanguageStore();
  const followUps = leads
    .filter(lead => lead.nextFollowUp)
    .sort((a, b) => {
      const dateA = a.nextFollowUp?.getTime() || 0;
      const dateB = b.nextFollowUp?.getTime() || 0;
      return dateA - dateB;
    });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-medium text-gray-900">{t('leads.calendar.title')}</h2>
      </div>
      <div className="divide-y">
        {followUps.length > 0 ? (
          followUps.map((lead) => (
            <div key={lead.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {lead.nextFollowUp?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            {t('leads.calendar.noFollowUps')}
          </div>
        )}
      </div>
    </div>
  );
}