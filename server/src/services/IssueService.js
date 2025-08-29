class IssueService {
    constructor(issueRepository) {
      this.issueRepository = issueRepository;
    }
  
    async createIssue(issueData) {
      // Validate required fields
      if (!issueData.title || !issueData.description) {
        throw new Error('Title and description are required');
      }
  
      // Set default values if not provided
      const issue = {
        title: issueData.title,
        description: issueData.description,
        status: issueData.status || 'open',
        priority: issueData.priority || 'medium',
        type: issueData.type || 'task',
        assignee: issueData.assignee || null,
        reporter: issueData.reporter,
        project: issueData.project || 'Default',
        dueDate: issueData.dueDate || null,
        labels: issueData.labels || []
      };
  
      return await this.issueRepository.create(issue);
    }
  
    async getIssueById(id) {
      const issue = await this.issueRepository.findById(id);
      if (!issue) {
        throw new Error('Issue not found');
      }
      return issue;
    }
  
    async getIssues(filters = {}, page = 1, limit = 10) {
      // Validate pagination parameters
      page = Math.max(1, parseInt(page));
      limit = Math.max(1, Math.min(100, parseInt(limit)));
      
      return await this.issueRepository.findAll(filters, page, limit);
    }
  
    async updateIssue(id, updateData, userId) {
      const issue = await this.issueRepository.findById(id);
      if (!issue) {
        throw new Error('Issue not found');
      }
  
      // Authorization check: only reporter or admin can update
      if (issue.reporter._id.toString() !== userId) {
        throw new Error('Not authorized to update this issue');
      }
  
      // Filter out fields that cannot be updated
      const allowedUpdates = ['title', 'description', 'status', 'priority', 'type', 'assignee', 'project', 'dueDate', 'labels'];
      const filteredUpdate = {};
      
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdate[key] = updateData[key];
        }
      });
  
      return await this.issueRepository.update(id, filteredUpdate);
    }
  
    async deleteIssue(id, userId) {
      const issue = await this.issueRepository.findById(id);
      if (!issue) {
        throw new Error('Issue not found');
      }
  
      // Authorization check: only reporter or admin can delete
      if (issue.reporter._id.toString() !== userId) {
        throw new Error('Not authorized to delete this issue');
      }
  
      return await this.issueRepository.delete(id);
    }
  
    async getIssueStats(project = null) {
      return await this.issueRepository.getStats(project);
    }
  }
  
  module.exports = IssueService;