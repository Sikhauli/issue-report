import React, { useState, useEffect } from 'react';
import { TextInput } from '@/common/inputs/TextInput';
import { SelectInput } from '@/common/inputs/SelectInput';
import { PrimaryButton } from '@/common/buttons/PrimaryButton';
import { SecondaryButton } from '@/common/buttons/SecondaryButton';

export const IssueForm = ({ issue, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    type: 'task',
    project: '',
    assignee: '',
    dueDate: '',
    labels: ''
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || '',
        description: issue.description || '',
        status: issue.status || 'open',
        priority: issue.priority || 'medium',
        type: issue.type || 'task',
        project: issue.project || '',
        assignee: issue.assignee || '',
        dueDate: issue.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : '',
        labels: issue.labels ? issue.labels.join(', ') : ''
      });
    }
  }, [issue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const issueData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      type: formData.type,
      project: formData.project,
      assignee: formData.assignee || undefined,
      dueDate: formData.dueDate || undefined,
      labels: formData.labels.split(',').map(label => label.trim()).filter(Boolean)
    };

    onSubmit(issueData);
  };

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

  const typeOptions = [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'task', label: 'Task' },
    { value: 'story', label: 'Story' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={onChange}
        required
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          required
          rows={4}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectInput
          label="Status"
          name="status"
          value={formData.status}
          onChange={onChange}
          options={statusOptions}
        />

        <SelectInput
          label="Type"
          name="type"
          value={formData.type}
          onChange={onChange}
          options={typeOptions}
        />

        <SelectInput
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={onChange}
          options={priorityOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="Assignee (User ID)"
          name="assignee"
          value={formData.assignee}
          onChange={onChange}
          placeholder="Optional user ID"
        />

        <TextInput
          label="Project"
          name="project"
          value={formData.project}
          onChange={onChange}
          required
        />

        <TextInput
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={onChange}
        />
      </div>


      <TextInput
        label="Labels"
        name="labels"
        value={formData.labels}
        onChange={onChange}
        placeholder="Comma-separated labels"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <SecondaryButton onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : (issue ? 'Update Issue' : 'Create Issue')}
        </PrimaryButton>
      </div>
    </form>
  );
};