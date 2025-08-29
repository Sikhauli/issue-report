import React, { useState, useEffect } from 'react';
import { useIssues, useIssueActions } from '../issueHooks';
import { useAuth } from '../../auth/authHooks';
import { IssueList } from './IssueList';
import { IssueForm } from './IssueForm';
import { IssueFilter } from './IssueFilter';
import { PrimaryButton } from '@/common/buttons/PrimaryButton';
import { getAxiosError, } from '../../../helpers/constant'
import { confirmAlert } from "react-confirm-alert";
import { useSnackbar } from "notistack";
import { hideLoading, showLoading } from "../../../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";

import "react-confirm-alert/src/react-confirm-alert.css";

export const IssuesPage = () => {

  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [users, setUsers] = useState([]);
  
  const { issues, loading, error, pagination, refetch } = useIssues(filters);
  const { createIssue, updateIssue, deleteIssue, loading: actionLoading } = useIssueActions();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleCreateIssue = () => {
    setEditingIssue(null);
    setShowForm(true);
  };

  const handleEditIssue = (issue) => {
    setEditingIssue(issue);
    setShowForm(true);
  };
  
  const handleDeleteIssue = async (id) => {
    confirmAlert({
      title: "DELETE ISSUE",
      message: "Are you sure you want to do this?",
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            dispatch(showLoading());
             deleteIssue(id)
              .then(() => {
                enqueueSnackbar("Successfully deleted issue!", { variant: "success" });
                refetch();
              })
              .catch((error) => {
                enqueueSnackbar(getAxiosError(error), { variant: "error" });
              })
              .finally(() => {
                dispatch(hideLoading());
              });
          },
        },
        {
          label: "Cancel",
          onClick: () => {}, // no-op
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };
  
  const handleSubmitIssue = async (issueData) => {
    try {
      if (editingIssue) {
        await updateIssue(editingIssue._id, issueData);
      } else {
        await createIssue(issueData);
      }
      setShowForm(false);
      refetch();
    } catch (error) {
      alert(error.message || 'Failed to save issue');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Issues</h2>
        <PrimaryButton onClick={handleCreateIssue}>
          Create Issue
        </PrimaryButton>
      </div>

      <IssueFilter filters={filters} onChange={handleFilterChange} />

      {showForm && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm left flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 rounded-lg p-6 w-full max-w-2xl max-h-[96vh]">
            <h3 className="text-xl font-semibold mb-4">
              {editingIssue ? 'Edit Issue' : 'Create Issue'}
            </h3>
            <IssueForm
              issue={editingIssue}
              onSubmit={handleSubmitIssue}
              onCancel={() => setShowForm(false)}
              loading={actionLoading}
            />
          </div>
        </div>
      )}

      <IssueList
        issues={issues}
        loading={loading}
        onEdit={handleEditIssue}
        onDelete={handleDeleteIssue}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            disabled={pagination.page === 1}
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};