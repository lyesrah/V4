import React from 'react';
import { Users, Filter, Calendar, PieChart } from 'lucide-react';
import LeadOverview from '../components/leads/LeadOverview';
import LeadVisualization from '../components/leads/LeadVisualization';
import LeadCalendar from '../components/leads/LeadCalendar';
import CreateLeadButton from '../components/leads/CreateLeadButton';

export default function LeadManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600">Track and manage your property leads</p>
          </div>
        </div>
        <CreateLeadButton />
      </div>

      <LeadOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadVisualization />
        <LeadCalendar />
      </div>
    </div>
  );
}