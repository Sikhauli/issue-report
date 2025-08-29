import { API } from '../../services/api';
import { API_ENDPOINTS } from '../../helpers/constant';

export const issueService = {
  async getIssues(filters = {}) {
    const response = await API.get(API_ENDPOINTS.ISSUES.get, { params: filters });
    return response.data;
  },

  async getIssue(id) {
    const response = await API.get(`${API_ENDPOINTS.ISSUES.get}/${id}`);
    return response.data;
  },

  async createIssue(issueData) {
    const response = await API.post(API_ENDPOINTS.ISSUES.create, issueData);
    return response.data;
  },

  async updateIssue(id, issueData) {
    const response = await API.put(`${API_ENDPOINTS.ISSUES.update}/${id}`, issueData);
    return response.data;
  },

  async deleteIssue(id) {
    const response = await API.delete(`${API_ENDPOINTS.ISSUES.delete}/${id}`);
    return response.data;
  },

  async getStats(project = null) {
    const response = await API.get(API_ENDPOINTS.ISSUES.stats, { 
      params: project ? { project } : {} 
    });
    return response.data;
  }
};