// server/src/routes/issueRoutes.js
const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const IssueController = require('../controllers/IssueController');
const IssueService = require('../services/IssueService');
const IssueRepository = require('../repositories/IssueRepository');

const router = express.Router();

// Dependency injection
const issueRepository = new IssueRepository();
const issueService = new IssueService(issueRepository);
const issueController = new IssueController(issueService);

// Validation rules
const issueValidationRules = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('status').optional().isIn(['open', 'in-progress', 'resolved', 'closed']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('type').optional().isIn(['bug', 'feature', 'task', 'story'])
];

// Apply auth middleware to all routes
router.use(auth);

// Routes
router.post('/', issueValidationRules, issueController.createIssue.bind(issueController));
router.get('/', issueController.getIssues.bind(issueController));
router.get('/stats', issueController.getStats.bind(issueController));
router.get('/:id', issueController.getIssue.bind(issueController));
router.put('/:id', issueValidationRules, issueController.updateIssue.bind(issueController));
router.delete('/:id', issueController.deleteIssue.bind(issueController));

module.exports = router;