import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * AuthContext for managing user authentication state
 * Persists session in localStorage
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('smartQRUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('smartQRUser');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem('smartQRUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartQRUser');
    }
  }, [user]);

  /**
   * Login user and persist session
   * @param {object} userData - User data from login/register
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Logout user and clear session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartQRUser');
  };

  /**
   * Update user data
   * @param {object} newData - New user data to merge
   */
  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  const isAuthenticated = () => {
    return !!user && !!user.generatedID;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;