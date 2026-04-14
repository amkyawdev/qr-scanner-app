import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firestore';
import { getUserProfile } from '../services/firestore';

const AuthContext = createContext(null);

/**
 * AuthContext for managing Firebase authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile.success) {
          setUser({ ...firebaseUser, ...profile });
        } else {
          // If no profile, use basic Firebase user info
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || 'User'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login user (handled by firestore.js)
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Logout user (handled by firestore.js)
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Update user data
   * @param {object} newData - New user data to merge
   */
  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  const isAuthenticated = () => {
    return !!user && !!user.uid;
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