import { useState, useEffect } from 'react';
import { issueService } from './issueServices';

import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { getAxiosError } from '../../helpers/constant'


export const useIssues = (filters = {}) => {
  const [state, setState] = useState({
    issues: [],
    loading: true,
    error: null,
    pagination: {}
  });

  const fetchIssues = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await issueService.getIssues(filters);
      if (response.success) {
        setState({
          issues: response.data,
          pagination: response.pagination,
          loading: false,
          error: null
        });
      } else {
        setState(prev => ({ ...prev, error: response.error, loading: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filters.status, filters.priority, filters.project, filters.page]);

  return {
    ...state,
    refetch: fetchIssues
  };
};

export const useIssueActions = () => {
  const [error, setError] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.value);
  
  const createIssue = async (issueData) => {
    dispatch(showLoading())
    setError(null);
    try {
      const response = await issueService.createIssue(issueData);
      enqueueSnackbar('Issue created successfully', { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getAxiosError(error), { variant: "error" });
    } finally {
      dispatch(hideLoading())
    }
  };

  const updateIssue = async (id, issueData) => {
    dispatch(showLoading())
    setError(null);
    try {
      const response = await issueService.updateIssue(id, issueData);
      enqueueSnackbar('Issue updated successfully', { variant: "success" });
      return response;
    } catch (error) {
      enqueueSnackbar(getAxiosError(error), { variant: "error" });
      throw error;
    } finally {
      dispatch(hideLoading())
    }
  };

  const deleteIssue = async (id) => {
    dispatch(showLoading())
    setError(null);
    try {
      const response = await issueService.deleteIssue(id);
      enqueueSnackbar('Issue deleted successfully', { variant: "success" });
      return response;
    } catch (error) {
      enqueueSnackbar(getAxiosError(error), { variant: "error" });
      throw error;
    } finally {
      dispatch(hideLoading())
    }
  };

  return {
    createIssue,
    updateIssue,
    deleteIssue,
    loading,
    error
  };
};