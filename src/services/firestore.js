import { initializeApp } from 'firebase/app';
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
const db = getFirestore(app);

/**
 * Generate a unique user ID based on name and random digits
 * Format: Name Prefix + 3 Random Digits + @gg
 * @param {string} name - User's full name
 * @returns {string} Generated unique ID
 */
export const generateUserId = (name) => {
  const prefix = name.slice(0, 3).toLowerCase().replace(/[^a-z]/g, 'xyz');
  const randomDigits = Math.floor(100 + Math.random() * 900).toString();
  return `${prefix}${randomDigits}@gg`;
};

/**
 * Register a new user
 * @param {string} fullName - User's full name
 * @returns {object} User data including generated ID
 */
export const registerUser = async (fullName) => {
  try {
    const generatedID = generateUserId(fullName);
    const userData = {
      fullName,
      generatedID,
      links: Array(10).fill({ name: '', url: '' }),
      createdAt: new Date().toISOString()
    };

    // Check if user already exists by trying to get the doc
    const userDoc = doc(db, 'users', generatedID);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      // Regenerate ID if collision
      return registerUser(fullName);
    }

    // Create new user document
    await setDoc(userDoc, userData);

    return { ...userData, success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login user with fullName and generatedID
 * @param {string} fullName - User's full name
 * @param {string} generatedID - User's generated ID
 * @returns {object} User data if found, null otherwise
 */
export const loginUser = async (fullName, generatedID) => {
  try {
    const userDoc = doc(db, 'users', generatedID);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.fullName.toLowerCase() === fullName.toLowerCase()) {
        return { ...userData, success: true };
      }
    }
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user links
 * @param {string} generatedID - User's generated ID
 * @param {array} links - Array of 10 link objects
 * @returns {object} Success status
 */
export const updateUserLinks = async (generatedID, links) => {
  try {
    const userDoc = doc(db, 'users', generatedID);
    await updateDoc(userDoc, { links, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error('Error updating links:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user data by ID (for QR profile view)
 * @param {string} generatedID - User's generated ID
 * @returns {object} User data if found
 */
export const getUserData = async (generatedID) => {
  try {
    const userDoc = doc(db, 'users', generatedID);
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

/**
 * Check if user exists by ID
 * @param {string} generatedID - User's generated ID
 * @returns {boolean} True if user exists
 */
export const checkUserExists = async (generatedID) => {
  try {
    const userDoc = doc(db, 'users', generatedID);
    const docSnap = await getDoc(userDoc);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
};

export { db };
export default app;