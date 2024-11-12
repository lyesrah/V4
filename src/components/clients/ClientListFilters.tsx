import React from 'react';
import SearchBar from '../common/SearchBar';
import FilterDropdown from '../common/FilterDropdown';

interface ClientListFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  cityFilter: string[];
  onCityFilterChange: (values: string[]) => void;
}

export default function ClientListFilters({
  search,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
}: ClientListFiltersProps) {
  const cityOptions = [
    { value: 'paris', label: 'Paris' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'marseille', label: 'Marseille' },
    { value: 'bordeaux', label: 'Bordeaux' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search clients by name, email, or phone..."
        />
      </div>
      <div className="flex gap-2">
        <FilterDropdown
          label="City"
          options={cityOptions}
          selectedValues={cityFilter}
          onChange={onCityFilterChange}
        />
      </div>
    </div>
  );
}