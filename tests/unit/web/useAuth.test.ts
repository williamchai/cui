import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM environment
const mockLocation = {
  hash: '',
  pathname: '/test',
  search: '',
};

const mockHistory = {
  replaceState: vi.fn(),
};

Object.defineProperty(global, 'window', {
  value: {
    location: mockLocation,
    history: mockHistory,
  },
  writable: true,
});

Object.defineProperty(global, 'document', {
  value: {
    cookie: '',
  },
  writable: true,
});

// Import after mocking
import { getAuthToken, setAuthToken } from '@/web/hooks/useAuth';

describe('useAuth token validation', () => {
  beforeEach(() => {
    // Reset mocks
    mockLocation.hash = '';
    mockHistory.replaceState.mockClear();
    document.cookie = '';
  });

  describe('token storage and retrieval', () => {
    it('should store and retrieve tokens of any length', () => {
      const shortToken = 'abc123';
      const longToken = 'verylongtokenthatismorethan32characterslong123456789';
      
      // Test short token
      setAuthToken(shortToken);
      expect(document.cookie).toContain(shortToken);
      
      // Reset cookie
      document.cookie = '';
      
      // Test long token
      setAuthToken(longToken);
      expect(document.cookie).toContain(encodeURIComponent(longToken));
    });

    it('should retrieve token from cookie regardless of length', () => {
      const testToken = 'any-length-token-123-xyz';
      document.cookie = `cui-auth-token=${encodeURIComponent(testToken)}`;
      
      const retrievedToken = getAuthToken();
      expect(retrievedToken).toBe(testToken);
    });
  });
});