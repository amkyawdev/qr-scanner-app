// Firebase Configuration
// Using environment variables for security

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBkfYALXNg6vAWuLtvhZHDhkvaQN5BsM-Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "amk-apk.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://amk-apk-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "amk-apk",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "amk-apk.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "267632318274",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:267632318274:web:1e0530543f77982304dadb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E2658JJ29R"
};

export default firebaseConfig;