import React from 'react';
import SearchBar from '../common/SearchBar';
import FilterDropdown from '../common/FilterDropdown';
import { LeadStatus, LeadRating } from '../../store/leadStore';
import { useLanguageStore } from '../../store/languageStore';

interface LeadListFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeadStatus[];
  onStatusFilterChange: (values: LeadStatus[]) => void;
  ratingFilter: LeadRating[];
  onRatingFilterChange: (values: LeadRating[]) => void;
  formulaFilter: string[];
  onFormulaFilterChange: (values: string[]) => void;
}

export default function LeadListFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ratingFilter,
  onRatingFilterChange,
  formulaFilter,
  onFormulaFilterChange
}: LeadListFiltersProps) {
  const { t } = useLanguageStore();

  const statusOptions = [
    { value: 'new', label: t('leads.status.new') },
    { value: 'contacted', label: t('leads.status.contacted') },
    { value: 'qualified', label: t('leads.status.qualified') },
    { value: 'proposal', label: t('leads.status.proposal') },
    { value: 'negotiation', label: t('leads.status.negotiation') },
    { value: 'closed', label: t('leads.status.closed') },
    { value: 'lost', label: t('leads.status.lost') }
  ];

  const ratingOptions = [
    { value: 'hot', label: t('leads.rating.hot') },
    { value: 'warm', label: t('leads.rating.warm') },
    { value: 'cold', label: t('leads.rating.cold') },
    { value: 'neutral', label: t('leads.rating.neutral') },
    { value: 'blocked', label: t('leads.rating.blocked') }
  ];

  const formulaOptions = [
    { value: 'Support + Cleaning Formula', label: 'Support + Cleaning Formula' },
    { value: 'Support Only Formula', label: 'Support Only Formula' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder={t('filters.search.leads')}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label={t('filters.status')}
          options={statusOptions}
          selectedValues={statusFilter}
          onChange={onStatusFilterChange}
        />
        <FilterDropdown
          label={t('filters.rating')}
          options={ratingOptions}
          selectedValues={ratingFilter}
          onChange={onRatingFilterChange}
        />
        <FilterDropdown
          label={t('filters.formula')}
          options={formulaOptions}
          selectedValues={formulaFilter}
          onChange={onFormulaFilterChange}
        />
      </div>
    </div>
  );
}