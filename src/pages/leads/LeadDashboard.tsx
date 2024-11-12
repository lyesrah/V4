import React, { useState, useMemo } from 'react';
import { useLeadStore, LeadStatus, LeadRating } from '../../store/leadStore';
import { useLanguageStore } from '../../store/languageStore';
import { Users } from 'lucide-react';
import LeadList from '../../components/leads/LeadList';
import LeadMetrics from '../../components/leads/LeadMetrics';
import LeadCalendar from '../../components/leads/LeadCalendar';
import LeadVisualization from '../../components/leads/LeadVisualization';
import CreateLeadButton from '../../components/leads/CreateLeadButton';
import LeadListFilters from '../../components/leads/LeadListFilters';

export default function LeadDashboard() {
  const { leads, getLeadMetrics } = useLeadStore();
  const { t } = useLanguageStore();
  const metrics = getLeadMetrics();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [ratingFilter, setRatingFilter] = useState<LeadRating[]>([]);
  const [formulaFilter, setFormulaFilter] = useState<string[]>([]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = search.toLowerCase().trim() === '' ||
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter.length === 0 ||
        statusFilter.includes(lead.status);

      const matchesRating = ratingFilter.length === 0 ||
        ratingFilter.includes(lead.rating);

      const matchesFormula = formulaFilter.length === 0 ||
        formulaFilter.includes(lead.formula);

      return matchesSearch && matchesStatus && matchesRating && matchesFormula;
    });
  }, [leads, search, statusFilter, ratingFilter, formulaFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('leads.title')}</h1>
            <p className="text-gray-600">{t('leads.subtitle')}</p>
          </div>
        </div>
        <CreateLeadButton />
      </div>

      <LeadListFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        formulaFilter={formulaFilter}
        onFormulaFilterChange={setFormulaFilter}
      />

      <LeadMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadVisualization />
        <LeadCalendar leads={filteredLeads} />
      </div>

      <LeadList leads={filteredLeads} />
    </div>
  );
}
