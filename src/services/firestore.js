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
 * Generate a unique user ID based on name and random digits
 * Format: Name Prefix + 3 Random Digits + @wx
 * @param {string} name - User's full name
 * @returns {string} Generated unique ID
 */
export const generateUserId = (name) => {
  const prefix = name.slice(0, 3).toLowerCase().replace(/[^a-z]/g, 'xyz');
  const randomDigits = Math.floor(100 + Math.random() * 900).toString();
  return `${prefix}${randomDigits}@wx`;
};

/**
 * Normalize URL - add https:// if missing
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 */
export const normalizeUrl = (url) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

/**
 * Detect platform from URL and return icon name
 * @param {string} url - URL to detect
 * @returns {string} Platform icon name
 */
export const detectPlatform = (url) => {
  if (!url) return 'Link';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('facebook') || lowerUrl.includes('fb.com') || lowerUrl.includes('m.facebook')) {
    return 'Facebook';
  }
  if (lowerUrl.includes('instagram') || lowerUrl.includes('ig.me')) {
    return 'Instagram';
  }
  if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) {
    return 'Twitter';
  }
  if (lowerUrl.includes('tiktok')) {
    return 'Video'; // TikTok icon
  }
  if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) {
    return 'Youtube';
  }
  if (lowerUrl.includes('linkedin')) {
    return 'Linkedin';
  }
  if (lowerUrl.includes('github')) {
    return 'Github';
  }
  if (lowerUrl.includes('telegram') || lowerUrl.includes('t.me')) {
    return 'Send'; // Telegram icon
  }
  if (lowerUrl.includes('whatsapp') || lowerUrl.includes('wa.me')) {
    return 'MessageCircle'; // WhatsApp icon
  }
  if (lowerUrl.includes('discord')) {
    return 'MessageSquare'; // Discord icon
  }
  if (lowerUrl.includes('email') || lowerUrl.includes('gmail') || lowerUrl.includes('mail.google')) {
    return 'Mail';
  }
  if (lowerUrl.includes('phone') || lowerUrl.includes('call')) {
    return 'Phone';
  }
  if (lowerUrl.includes('location') || lowerUrl.includes('maps')) {
    return 'MapPin';
  }
  
  return 'Link';
};

/**
 * Register a new user with email/password
 * Also creates a user profile in Firestore
 */
export const registerUser = async (email, password, fullName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate unique ID
    const generatedID = generateUserId(fullName);
    
    // Update display name
    await updateProfile(user, { displayName: fullName });

    // Create user profile in Firestore
    const userData = {
      uid: user.uid,
      email,
      fullName,
      generatedID,
      socialLinks: Array(10).fill({ name: '', url: '' }),
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

    // If no profile exists, create basic profile with generatedID
    const generatedID = generateUserId(user.displayName || 'user');
    const userData = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName || 'User',
      generatedID,
      socialLinks: Array(10).fill({ name: '', url: '' }),
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
 * Update user social links
 */
export const updateUserSocialLinks = async (uid, socialLinks) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, { socialLinks, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error('Error updating links:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user links (alias for backward compatibility)
 */
export const updateUserLinks = async (uid, links) => {
  return updateUserSocialLinks(uid, links);
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