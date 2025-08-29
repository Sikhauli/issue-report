const IssueService = require('../../src/services/IssueService');

const mockIssueRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getStats: jest.fn()
};

jest.mock('../../src/repositories/IssueRepository', () => {
  return jest.fn(() => mockIssueRepository);
});

const IssueRepository = require('../../src/repositories/IssueRepository');

describe('IssueService', () => {
  let issueService;

  beforeEach(() => {
    jest.clearAllMocks();    
    issueService = new IssueService(mockIssueRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createIssue', () => {
    it('should create an issue with required fields', async () => {
      const issueData = {
        title: 'Test Issue',
        description: 'Test Description',
        reporter: 'user123'
      };

      const expectedIssue = {
        _id: 'issue123',
        ...issueData,
        status: 'open',
        priority: 'medium',
        type: 'task',
        assignee: null,
        project: 'Default',
        dueDate: null,
        labels: []
      };

      mockIssueRepository.create.mockResolvedValue(expectedIssue);

      const result = await issueService.createIssue(issueData);

      expect(mockIssueRepository.create).toHaveBeenCalledWith({
        title: 'Test Issue',
        description: 'Test Description',
        status: 'open',
        priority: 'medium',
        type: 'task',
        assignee: null,
        reporter: 'user123',
        project: 'Default',
        dueDate: null,
        labels: []
      });
      expect(result).toEqual(expectedIssue);
    });

    it('should throw error when title is missing', async () => {
      const issueData = {
        description: 'Test Description',
        reporter: 'user123'
      };

      await expect(issueService.createIssue(issueData)).rejects.toThrow(
        'Title and description are required'
      );
      
      expect(mockIssueRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when description is missing', async () => {
      const issueData = {
        title: 'Test Issue',
        reporter: 'user123'
      };

      await expect(issueService.createIssue(issueData)).rejects.toThrow(
        'Title and description are required'
      );
      
      expect(mockIssueRepository.create).not.toHaveBeenCalled();
    });

    it('should use provided optional fields', async () => {
      const issueData = {
        title: 'Test Issue',
        description: 'Test Description',
        status: 'closed',
        priority: 'high',
        type: 'bug',
        assignee: 'assignee123',
        reporter: 'user123',
        project: 'ProjectX',
        dueDate: '2023-12-31',
        labels: ['urgent', 'backend']
      };

      const expectedIssue = { _id: 'issue123', ...issueData };
      mockIssueRepository.create.mockResolvedValue(expectedIssue);

      const result = await issueService.createIssue(issueData);

      expect(mockIssueRepository.create).toHaveBeenCalledWith(issueData);
      expect(result).toEqual(expectedIssue);
    });
  });

  describe('getIssueById', () => {
    it('should return issue when found', async () => {
      const mockIssue = { _id: 'issue123', title: 'Test Issue' };
      mockIssueRepository.findById.mockResolvedValue(mockIssue);

      const result = await issueService.getIssueById('issue123');

      expect(mockIssueRepository.findById).toHaveBeenCalledWith('issue123');
      expect(result).toEqual(mockIssue);
    });

    it('should throw error when issue not found', async () => {
      mockIssueRepository.findById.mockResolvedValue(null);

      await expect(issueService.getIssueById('nonexistent')).rejects.toThrow(
        'Issue not found'
      );
    });
  });

  describe('getIssues', () => {
    it('should get issues with filters and pagination', async () => {
      const mockIssues = [{ _id: 'issue1' }, { _id: 'issue2' }];
      const mockResponse = {
        issues: mockIssues,
        total: 2,
        page: 1,
        totalPages: 1
      };

      mockIssueRepository.findAll.mockResolvedValue(mockResponse);

      const filters = { status: 'open' };
      const result = await issueService.getIssues(filters, 1, 10);

      expect(mockIssueRepository.findAll).toHaveBeenCalledWith(
        { status: 'open' },
        1,
        10
      );
      expect(result).toEqual(mockResponse);
    });

    it('should validate pagination parameters', async () => {
      const mockResponse = { issues: [], total: 0, page: 1, totalPages: 0 };
      mockIssueRepository.findAll.mockResolvedValue(mockResponse);

      await issueService.getIssues({}, -1, -1);
      expect(mockIssueRepository.findAll).toHaveBeenCalledWith({}, 1, 1);

      await issueService.getIssues({}, '2', '101');
      expect(mockIssueRepository.findAll).toHaveBeenCalledWith({}, 2, 100);
    });
  });

  describe('updateIssue', () => {
    const mockIssue = {
      _id: 'issue123',
      title: 'Old Title',
      reporter: { _id: 'user123' }
    };

    it('should update issue when authorized', async () => {
      mockIssueRepository.findById.mockResolvedValue(mockIssue);
      mockIssueRepository.update.mockResolvedValue({
        ...mockIssue,
        title: 'New Title'
      });

      const updateData = { title: 'New Title', description: 'New Desc' };
      const result = await issueService.updateIssue('issue123', updateData, 'user123');

      expect(mockIssueRepository.update).toHaveBeenCalledWith('issue123', {
        title: 'New Title',
        description: 'New Desc'
      });
      expect(result.title).toBe('New Title');
    });

    it('should throw error when not authorized', async () => {
      mockIssueRepository.findById.mockResolvedValue(mockIssue);

      await expect(
        issueService.updateIssue('issue123', { title: 'New Title' }, 'differentUser')
      ).rejects.toThrow('Not authorized to update this issue');
      
      // Verify repository.update was NOT called
      expect(mockIssueRepository.update).not.toHaveBeenCalled();
    });

    it('should filter out disallowed update fields', async () => {
      mockIssueRepository.findById.mockResolvedValue(mockIssue);
      mockIssueRepository.update.mockResolvedValue(mockIssue);

      const updateData = {
        title: 'New Title',
        unauthorizedField: 'should be filtered',
        reporter: 'should be filtered',
        createdAt: 'should be filtered' 
      };

      await issueService.updateIssue('issue123', updateData, 'user123');

      expect(mockIssueRepository.update).toHaveBeenCalledWith('issue123', {
        title: 'New Title'
      });
    });
  });

  describe('deleteIssue', () => {
    const mockIssue = {
      _id: 'issue123',
      reporter: { _id: 'user123' }
    };

    it('should delete issue when authorized', async () => {
      mockIssueRepository.findById.mockResolvedValue(mockIssue);
      mockIssueRepository.delete.mockResolvedValue(true);

      const result = await issueService.deleteIssue('issue123', 'user123');

      expect(mockIssueRepository.delete).toHaveBeenCalledWith('issue123');
      expect(result).toBe(true);
    });

    it('should throw error when not authorized to delete', async () => {
      mockIssueRepository.findById.mockResolvedValue(mockIssue);

      await expect(
        issueService.deleteIssue('issue123', 'differentUser')
      ).rejects.toThrow('Not authorized to delete this issue');
      
      // Verify repository.delete was NOT called
      expect(mockIssueRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getIssueStats', () => {
    it('should get statistics with project filter', async () => {
      const mockStats = { open: 5, closed: 3, total: 8 };
      mockIssueRepository.getStats.mockResolvedValue(mockStats);

      const result = await issueService.getIssueStats('ProjectX');

      expect(mockIssueRepository.getStats).toHaveBeenCalledWith('ProjectX');
      expect(result).toEqual(mockStats);
    });

    it('should get statistics without project filter', async () => {
      const mockStats = { open: 10, closed: 5, total: 15 };
      mockIssueRepository.getStats.mockResolvedValue(mockStats);

      const result = await issueService.getIssueStats();

      expect(mockIssueRepository.getStats).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockStats);
    });
  });

  // Additional edge case tests
  describe('edge cases', () => {
    it('should handle repository errors gracefully', async () => {
      const errorMessage = 'Database connection failed';
      mockIssueRepository.create.mockRejectedValue(new Error(errorMessage));

      const issueData = {
        title: 'Test Issue',
        description: 'Test Description',
        reporter: 'user123'
      };

      await expect(issueService.createIssue(issueData)).rejects.toThrow(errorMessage);
    });

    it('should handle empty filters in getIssues', async () => {
      const mockResponse = { issues: [], total: 0, page: 1, totalPages: 0 };
      mockIssueRepository.findAll.mockResolvedValue(mockResponse);

      const result = await issueService.getIssues({}, 1, 10);

      expect(mockIssueRepository.findAll).toHaveBeenCalledWith({}, 1, 10);
      expect(result).toEqual(mockResponse);
    });
  });
});