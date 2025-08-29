import React from 'react';
import { SelectInput } from '@/common/inputs/SelectInput';
import { TextInput } from '@/common/inputs/TextInput';
import { SecondaryButton } from '@/common/buttons/SecondaryButton';

export const IssueFilter = ({ filters, onChange }) => {
  const handleFilterChange = (key, value) => {
    onChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onChange({
      page: 1,
      limit: 10
    });
  };

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleInputChange = (e) => {
    handleFilterChange(e.target.name, e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectInput
          label="Status"
          name="status"
          value={filters.status || ''}
          onChange={handleInputChange}
          options={statusOptions}
        />

        <SelectInput
          label="Priority"
          name="priority"
          value={filters.priority || ''}
          onChange={handleInputChange}
          options={priorityOptions}
        />

        <TextInput
          label="Project"
          name="project"
          value={filters.project || ''}
          onChange={handleInputChange}
          placeholder="Filter by project"
        />

        <TextInput
          label="Assignee"
          name="assignee"
          value={filters.assignee || ''}
          onChange={handleInputChange}
          placeholder="Filter by assignee ID"
        />
      </div>

      <div className="mt-4">
        <SecondaryButton onClick={clearFilters}>
          Clear Filters
        </SecondaryButton>
      </div>
    </div>
  );
};