const { validationResult } = require('express-validator');

class IssueController {
  constructor(issueService) {
    this.issueService = issueService;
  }

  async createIssue(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const issue = await this.issueService.createIssue({
        ...req.body,
        reporter: req.user.id
      });
      
      res.status(201).json({
        success: true,
        data: issue
      });
    } catch (error) {
      next(error);
    }
  }

  async getIssue(req, res, next) {
    try {
      const issue = await this.issueService.getIssueById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: issue
      });
    } catch (error) {
      next(error);
    }
  }

  async getIssues(req, res, next) {
    try {
      const { page = 1, limit = 10, status, priority, project, assignee } = req.query;
      
      // Build filter object
      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (project) filters.project = project;
      if (assignee) filters.assignee = assignee;
      
      const result = await this.issueService.getIssues(filters, page, limit);
      
      res.status(200).json({
        success: true,
        data: result.issues,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateIssue(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const issue = await this.issueService.updateIssue(
        req.params.id, 
        req.body, 
        req.user.id
      );
      
      res.status(200).json({
        success: true,
        data: issue
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteIssue(req, res, next) {
    try {
      await this.issueService.deleteIssue(req.params.id, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Issue deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const { project } = req.query;
      const stats = await this.issueService.getIssueStats(project);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = IssueController;