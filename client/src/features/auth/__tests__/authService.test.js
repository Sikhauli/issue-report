import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API } from '../../../services/api';
import { API_ENDPOINTS } from '../../../helpers/constant';
import { authService } from '../authServices';

vi.mock('../../../services/api');
vi.mock('../../../helpers/constant');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all localStorage mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('login', () => {
    it('should call API.post with correct endpoint and credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { data: { success: true, data: { user: {}, token: 'test-token' } } };
      
      API.post.mockResolvedValue(mockResponse);
      API_ENDPOINTS.AUTH = { login: 'auth/login' };

      const result = await authService.login(credentials);

      expect(API.post).toHaveBeenCalledWith('auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login errors', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Login failed');
      
      API.post.mockRejectedValue(error);
      API_ENDPOINTS.AUTH = { login: 'auth/login' };

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('should call API.post with correct endpoint and user data', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const mockResponse = { data: { success: true, data: { user: {}, token: 'test-token' } } };
      
      API.post.mockResolvedValue(mockResponse);
      API_ENDPOINTS.AUTH = { register: 'auth/register' };

      const result = await authService.register(userData);

      expect(API.post).toHaveBeenCalledWith('auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration errors', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const error = new Error('Registration failed');
      
      API.post.mockRejectedValue(error);
      API_ENDPOINTS.AUTH = { register: 'auth/register' };

      await expect(authService.register(userData)).rejects.toThrow('Registration failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should call API.get with correct endpoint', async () => {
      const mockResponse = { data: { success: true, data: { user: { id: 1, name: 'Test User' } } } };
      
      API.get.mockResolvedValue(mockResponse);
      API_ENDPOINTS.AUTH = { currentUser: 'auth/me' };

      const result = await authService.getCurrentUser();

      expect(API.get).toHaveBeenCalledWith('auth/me');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getCurrentUser errors', async () => {
      const error = new Error('Failed to get current user');
      
      API.get.mockRejectedValue(error);
      API_ENDPOINTS.AUTH = { currentUser: 'auth/me' };

      await expect(authService.getCurrentUser()).rejects.toThrow('Failed to get current user');
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test-token');
      authService.logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('should not throw error if no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);      
      expect(() => authService.logout()).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });
});