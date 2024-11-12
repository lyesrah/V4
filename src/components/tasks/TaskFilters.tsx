import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (values: string[]) => void;
  priorityFilter: string[];
  onPriorityFilterChange: (values: string[]) => void;
  propertyFilter: string[];
  onPropertyFilterChange: (values: string[]) => void;
  dateRange: { from: Date | null; to: Date | null };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  properties: Property[];
}

const statusOptions = [
  { value: 'not_started', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
];

const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'medium', label: 'Medium' },
  { value: 'normal', label: 'Normal' },
];

export default function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  propertyFilter,
  onPropertyFilterChange,
  dateRange,
  onDateRangeChange,
  properties,
}: TaskFiltersProps) {
  const toggleFilter = (
    value: string,
    currentFilters: string[],
    setFilters: (values: string[]) => void
  ) => {
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button variant="outline" onClick={() => onDateRangeChange({ from: null, to: null })}>
          Clear Date Filter
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Badge
            key={status.value}
            variant={statusFilter.includes(status.value) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleFilter(status.value, statusFilter, onStatusFilterChange)}
          >
            {status.label}
          </Badge>
        ))}

        {priorityOptions.map((priority) => (
          <Badge
            key={priority.value}
            variant={priorityFilter.includes(priority.value) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleFilter(priority.value, priorityFilter, onPriorityFilterChange)}
          >
            {priority.label}
          </Badge>
        ))}

        {properties.map((property) => (
          <Badge
            key={property.id}
            variant={propertyFilter.includes(property.id) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleFilter(property.id, propertyFilter, onPropertyFilterChange)}
          >
            {property.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}