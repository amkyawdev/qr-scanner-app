import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from './firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Register a new user with email/password
 * Also creates a user profile in Firestore
 */
export const registerUser = async (email, password, fullName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: fullName });

    // Create user profile in Firestore
    const userData = {
      uid: user.uid,
      email,
      fullName,
      links: Array(10).fill({ name: '', url: '' }),
      createdAt: new Date().toISOString()
    };

    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, userData);

    return { ...userData, success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return { ...docSnap.data(), success: true };
    }

    // If no profile exists, create basic profile
    const userData = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName || 'User',
      links: Array(10).fill({ name: '', url: '' }),
      createdAt: new Date().toISOString()
    };

    await setDoc(userDoc, userData);
    return { ...userData, success: true };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, data) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { ...data, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile by UID
 */
export const getUserProfile = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return { ...docSnap.data(), success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user links
 */
export const updateUserLinks = async (uid, links) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { links, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error('Error updating links:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user data by ID (for QR profile view)
 */
export const getUserData = async (userId) => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return { ...docSnap.data(), success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

export { auth, db };
export default app;