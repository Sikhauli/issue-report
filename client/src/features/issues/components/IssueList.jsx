import React from 'react';
import { IssueCard } from './IssueCard';

export const IssueList = ({ issues, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (issues?.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No issues found. Create your first issue!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues?.map(issue => (
        <IssueCard
          key={issue._id}
          issue={issue}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};