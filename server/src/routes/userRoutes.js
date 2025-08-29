const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');
const auth = require('../middleware/auth');

const router = express.Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Validation rules
const registerValidationRules = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidationRules, userController.register.bind(userController));
router.post('/login', loginValidationRules, userController.login.bind(userController));
router.get('/me', auth, userController.getCurrentUser.bind(userController));

module.exports = router;