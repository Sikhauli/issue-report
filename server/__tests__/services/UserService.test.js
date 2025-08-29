const jwt = require('jsonwebtoken');
const UserService = require('../../src/services/UserService');

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn()
};

jest.mock('../../src/repositories/UserRepository', () => {
  return jest.fn(() => mockUserRepository);
});

jest.mock('jsonwebtoken');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    jest.clearAllMocks();    
    userService = new UserService(mockUserRepository);    
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRE = '7d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const mockToken = 'mock-jwt-token';
      jwt.sign.mockReturnValue(mockToken);

      const result = userService.generateToken('user123');

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123' },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(result).toBe(mockToken);
    });

    it('should use default expire time if not set', () => {
      delete process.env.JWT_EXPIRE;
      const mockToken = 'mock-jwt-token';
      jwt.sign.mockReturnValue(mockToken);

      const result = userService.generateToken('user123');

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123' },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(result).toBe(mockToken);
    });

    it('should throw error if JWT secret is not defined', () => {
      delete process.env.JWT_SECRET;
      
      expect(() => userService.generateToken('user123')).toThrow('JWT_SECRET is not defined');
    });

    it('should handle JWT signing errors', () => {
      const error = new Error('JWT signing failed');
      jwt.sign.mockImplementation(() => {
        throw error;
      });

      expect(() => userService.generateToken('user123')).toThrow('JWT signing failed');
    });
  });

  describe('register', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      _id: 'user123',
      ...userData,
      comparePassword: jest.fn()
    };

    it('should register a new user successfully', async () => {
      const mockToken = 'mock-jwt-token';

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      const result = await userService.register(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123' },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: mockUser,
        token: mockToken
      });
    });

    it('should throw error when user already exists', async () => {
      const existingUser = { _id: 'existingUser' };
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.register(userData)).rejects.toThrow(
        'User already exists with this email'
      );      
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error when email is missing', async () => {
      const invalidUserData = { password: 'password123' };

      await expect(userService.register(invalidUserData)).rejects.toThrow(
        'Invalid credentials'
      );
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when password is missing', async () => {
      const invalidUserData = { email: 'test@example.com' };

      await expect(userService.register(invalidUserData)).rejects.toThrow(
        'Invalid credentials'
      );
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors during registration', async () => {
      const errorMessage = 'Database error';
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockRejectedValue(new Error(errorMessage));

      await expect(userService.register(userData)).rejects.toThrow(errorMessage);
    });

    it('should handle validation errors from repository', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const validationError = new Error('Validation failed: email must be valid');
      mockUserRepository.create.mockRejectedValue(validationError);

      await expect(userService.register(userData)).rejects.toThrow('Validation failed');
    });
  });

  describe('login', () => {
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword',
      comparePassword: jest.fn(),
      toJSON: jest.fn().mockReturnValue({
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      })
    };

    beforeEach(() => {
      mockUser.comparePassword.mockReset();
    });

    it('should login successfully with valid credentials', async () => {
      const mockToken = 'mock-jwt-token';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await userService.login('test@example.com', 'password123');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123' },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: mockUser.toJSON(),
        token: mockToken
      });
    });

    it('should throw error for non-existent email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login('nonexistent@example.com', 'password123'))
        .rejects.toThrow('Invalid credentials');      
      expect(mockUser.comparePassword).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error for incorrect password', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(userService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');      
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error for empty email', async () => {
      await expect(userService.login('', 'password123'))
        .rejects.toThrow('Invalid credentials');
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUser.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw error for empty password', async () => {
      await expect(userService.login('test@example.com', ''))
        .rejects.toThrow('Invalid credentials');
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUser.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw error for null email', async () => {
      await expect(userService.login(null, 'password123'))
        .rejects.toThrow('Invalid credentials');
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw error for null password', async () => {
      await expect(userService.login('test@example.com', null))
        .rejects.toThrow('Invalid credentials');
      
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should handle errors during password comparison', async () => {
      const errorMessage = 'Password comparison failed';
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockRejectedValue(new Error(errorMessage));

      await expect(userService.login('test@example.com', 'password123'))
        .rejects.toThrow(errorMessage);
    });

    it('should handle database connection errors during login', async () => {
      const errorMessage = 'Database connection timeout';
      mockUserRepository.findByEmail.mockRejectedValue(new Error(errorMessage));

      await expect(userService.login('test@example.com', 'password123'))
        .rejects.toThrow(errorMessage);
    });

    it('should handle user without comparePassword method', async () => {
      const userWithoutCompare = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
        toJSON: jest.fn().mockReturnValue({ _id: 'user123', email: 'test@example.com' })
        // Note: no comparePassword method
      };

      mockUserRepository.findByEmail.mockResolvedValue(userWithoutCompare);

      await expect(userService.login('test@example.com', 'password123'))
        .rejects.toThrow('user.comparePassword is not a function');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getCurrentUser('user123');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.getCurrentUser('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle repository errors when getting current user', async () => {
      const errorMessage = 'Database connection failed';
      mockUserRepository.findById.mockRejectedValue(new Error(errorMessage));

      await expect(userService.getCurrentUser('user123')).rejects.toThrow(errorMessage);
    });

    it('should handle invalid user ID format', async () => {
      await expect(userService.getCurrentUser('invalid-id-format'))
        .rejects.toThrow();
    });

    it('should handle null user ID', async () => {
      await expect(userService.getCurrentUser(null)).rejects.toThrow();
    });

    it('should handle undefined user ID', async () => {
      await expect(userService.getCurrentUser(undefined)).rejects.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle case-insensitive email lookup', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'TEST@example.com', 
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ _id: 'user123', email: 'TEST@example.com' })
      };

      mockUserRepository.findByEmail.mockImplementation((email) => {
        if (email.toLowerCase() === 'test@example.com') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      });

      const mockToken = 'mock-jwt-token';
      jwt.sign.mockReturnValue(mockToken);

      const result = await userService.login('test@example.com', 'password123');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toBeDefined();
    });

    it('should handle JWT signing errors during registration', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        comparePassword: jest.fn()
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      
      const jwtError = new Error('JWT signing failed');
      jwt.sign.mockImplementation(() => {
        throw jwtError;
      });

      await expect(userService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('JWT signing failed');
    });

    it('should handle network timeouts', async () => {
      mockUserRepository.findByEmail.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      );

      await expect(userService.login('test@example.com', 'password123'))
        .rejects.toThrow('Network timeout');
    });
  });
});