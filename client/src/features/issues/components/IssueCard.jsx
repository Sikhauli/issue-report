import React from 'react';
import { SecondaryButton } from '@/common/buttons/SecondaryButton';

export const IssueCard = ({ issue, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-purple-100 text-purple-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
        <div className="flex space-x-2">
          <SecondaryButton onClick={() => onEdit(issue)}>
            Edit
          </SecondaryButton>
          <button 
            onClick={() => onDelete(issue._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:text-red-500 hover:bg-white"
          >
            Delete
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-3">{issue.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(issue.priority)}`}>
          {issue.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(issue.status)}`}>
          {issue.status}
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {issue.type}
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {issue.project}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {issue.labels.map((label, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 rounded-full">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          {issue.dueDate && (
            <span className="mr-4">Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
          )}
          <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};