import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API } from '../../../services/api';
import { API_ENDPOINTS } from '../../../helpers/constant';
import { issueService } from '../issueServices';

vi.mock('../../../services/api');
vi.mock('../../../helpers/constant');

describe('issueService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getIssues', () => {
    it('should call API.get with correct endpoint and filters', async () => {
      const filters = { status: 'open', page: 1, limit: 10 };
      const mockResponse = { data: { success: true, data: { issues: [], pagination: {} } } };
      
      API.get.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { get: 'issues' };

      const result = await issueService.getIssues(filters);

      expect(API.get).toHaveBeenCalledWith('issues', { params: filters });
      expect(result).toEqual(mockResponse.data);
    });

    it('should call API.get without filters when none provided', async () => {
      const mockResponse = { data: { success: true, data: { issues: [], pagination: {} } } };
      
      API.get.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { get: 'issues' };

      const result = await issueService.getIssues();

      expect(API.get).toHaveBeenCalledWith('issues', { params: {} });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getIssues errors', async () => {
      const error = new Error('Failed to fetch issues');
      
      API.get.mockRejectedValue(error);
      API_ENDPOINTS.ISSUES = { get: 'issues' };

      await expect(issueService.getIssues()).rejects.toThrow('Failed to fetch issues');
    });
  });

  describe('getIssue', () => {
    it('should call API.get with correct endpoint and ID', async () => {
      const issueId = '123';
      const mockResponse = { data: { success: true, data: { id: issueId, title: 'Test Issue' } } };
      
      API.get.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { get: 'issues' };

      const result = await issueService.getIssue(issueId);

      expect(API.get).toHaveBeenCalledWith('issues/123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getIssue errors', async () => {
      const issueId = '123';
      const error = new Error('Failed to fetch issue');
      
      API.get.mockRejectedValue(error);
      API_ENDPOINTS.ISSUES = { get: 'issues' };

      await expect(issueService.getIssue(issueId)).rejects.toThrow('Failed to fetch issue');
    });
  });

  describe('createIssue', () => {
    it('should call API.post with correct endpoint and issue data', async () => {
      const issueData = { title: 'Test Issue', description: 'Test description' };
      const mockResponse = { data: { success: true, data: { id: '123', ...issueData } } };
      
      API.post.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { create: 'issues' };

      const result = await issueService.createIssue(issueData);

      expect(API.post).toHaveBeenCalledWith('issues', issueData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle createIssue errors', async () => {
      const issueData = { title: 'Test Issue', description: 'Test description' };
      const error = new Error('Failed to create issue');
      
      API.post.mockRejectedValue(error);
      API_ENDPOINTS.ISSUES = { create: 'issues' };

      await expect(issueService.createIssue(issueData)).rejects.toThrow('Failed to create issue');
    });
  });

  describe('updateIssue', () => {
    it('should call API.put with correct endpoint and issue data', async () => {
      const issueId = '123';
      const issueData = { title: 'Updated Issue', description: 'Updated description' };
      const mockResponse = { data: { success: true, data: { id: issueId, ...issueData } } };
      
      API.put.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { update: 'issues' };

      const result = await issueService.updateIssue(issueId, issueData);

      expect(API.put).toHaveBeenCalledWith('issues/123', issueData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle updateIssue errors', async () => {
      const issueId = '123';
      const issueData = { title: 'Updated Issue', description: 'Updated description' };
      const error = new Error('Failed to update issue');
      
      API.put.mockRejectedValue(error);
      API_ENDPOINTS.ISSUES = { update: 'issues' };

      await expect(issueService.updateIssue(issueId, issueData)).rejects.toThrow('Failed to update issue');
    });
  });

  describe('deleteIssue', () => {
    it('should call API.delete with correct endpoint', async () => {
      const issueId = '123';
      const mockResponse = { data: { success: true, message: 'Issue deleted' } };
      
      API.delete.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { delete: 'issues' };

      const result = await issueService.deleteIssue(issueId);

      expect(API.delete).toHaveBeenCalledWith('issues/123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle deleteIssue errors', async () => {
      const issueId = '123';
      const error = new Error('Failed to delete issue');
      
      API.delete.mockRejectedValue(error);
      API_ENDPOINTS.ISSUES = { delete: 'issues' };

      await expect(issueService.deleteIssue(issueId)).rejects.toThrow('Failed to delete issue');
    });
  });

  describe('getStats', () => {
    it('should call API.get with correct endpoint and project filter', async () => {
      const project = 'test-project';
      const mockResponse = { data: { success: true, data: { open: 5, closed: 3 } } };
      
      API.get.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { stats: 'issues/stats' };

      const result = await issueService.getStats(project);

      expect(API.get).toHaveBeenCalledWith('issues/stats', { params: { project } });
      expect(result).toEqual(mockResponse.data);
    });

    it('should call API.get without project filter when none provided', async () => {
      const mockResponse = { data: { success: true, data: { open: 5, closed: 3 } } };
      
      API.get.mockResolvedValue(mockResponse);
      API_ENDPOINTS.ISSUES = { stats: 'issues/stats' };

      const result = await issueService.getStats();

      expect(API.get).toHaveBeenCalledWith('issues/stats', { params: {} });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getStats errors', async () => {
      const error = new Error('Failed to fetch stats');
      
      API.get.mockRejectedValue(error);
      API_ENDPOINTS.ISSUES = { stats: 'issues/stats' };

      await expect(issueService.getStats()).rejects.toThrow('Failed to fetch stats');
    });
  });
});