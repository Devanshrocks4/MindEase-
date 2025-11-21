import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize user ID (anonymous or authenticated) - PERSIST ACROSS SESSIONS
  useEffect(() => {
    const initializeUserId = () => {
      // First check if user is authenticated
      const storedAuthUser = localStorage.getItem('mindease_auth_user');
      if (storedAuthUser) {
        const authUser = JSON.parse(storedAuthUser);
        setCurrentUser(authUser);
        setUserId(authUser.uid);
        // Check if admin email
        const adminEmails = ['admin@mindease.com', 'admin@mind.com', 'devansh@mindease.com', 'jasica@kaur.com', 'devansh@gupta.com'];
        setIsAdmin(adminEmails.includes(authUser.email.toLowerCase()));
        return;
      }

      // Check for existing anonymous user ID
      const storedUserId = localStorage.getItem('mindease_user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        // Create new anonymous user ID
        const newUserId = 'User_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setUserId(newUserId);
        localStorage.setItem('mindease_user_id', newUserId);
      }
    };

    initializeUserId();
  }, []);

  // Sign up function
  const signup = async (email, password, displayName) => {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode: simulate successful registration
      console.log('Demo mode: Simulating user registration');
      const mockUser = {
        uid: 'demo_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        email,
        displayName
      };
      setCurrentUser(mockUser);
      setUserId(mockUser.uid);
      localStorage.setItem('mindease_auth_user', JSON.stringify(mockUser));
      localStorage.setItem('mindease_user_id', mockUser.uid);
      return { user: mockUser };
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    // Update userId to authenticated user's UID
    setUserId(userCredential.user.uid);
    localStorage.setItem('mindease_auth_user', JSON.stringify(userCredential.user));
    localStorage.setItem('mindease_user_id', userCredential.user.uid);
    return userCredential;
  };

  // Login function
  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode: check for specific admin credentials
      const adminCredentials = {
        'jasica@kaur.com': 'jasicakaur',
        'devansh@gupta.com': 'devanshgupta'
      };

      let mockUser;
      if (adminCredentials[email] && adminCredentials[email] === password) {
        console.log('Demo mode: Admin login successful');
        // Generate consistent UID for admin based on email
        const consistentUid = 'admin_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substr(0, 10);
        mockUser = {
          uid: consistentUid,
          email,
          displayName: email.split('@')[0]
        };
      } else {
        // Simulate successful login for other emails with consistent UID
        console.log('Demo mode: Simulating user login');
        const consistentUid = 'demo_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substr(0, 10);
        mockUser = {
          uid: consistentUid,
          email,
          displayName: email.split('@')[0]
        };
      }
      setCurrentUser(mockUser);
      setUserId(mockUser.uid);
      localStorage.setItem('mindease_auth_user', JSON.stringify(mockUser));
      localStorage.setItem('mindease_user_id', mockUser.uid);
      return { user: mockUser };
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Update userId to authenticated user's UID
    setUserId(userCredential.user.uid);
    localStorage.setItem('mindease_auth_user', JSON.stringify(userCredential.user));
    localStorage.setItem('mindease_user_id', userCredential.user.uid);
    return userCredential;
  };

  // Logout function
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    // Clear authenticated user data but keep anonymous user ID for continuity
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('mindease_auth_user');
    // Keep the anonymous user ID so assessments persist across sessions
    // Only generate new ID if no anonymous ID exists
    const existingUserId = localStorage.getItem('mindease_user_id');
    if (!existingUserId) {
      const newUserId = 'User_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setUserId(newUserId);
      localStorage.setItem('mindease_user_id', newUserId);
    }
  };

  // Reset password function
  const resetPassword = (email) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
    }
    return sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = (updates) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase authentication is not configured. Please set up Firebase environment variables.');
    }
    return updateProfile(auth.currentUser, updates);
  };

  // Listen for auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setUserId(user.uid);
        localStorage.setItem('mindease_auth_user', JSON.stringify(user));
        localStorage.setItem('mindease_user_id', user.uid);
        // Check if admin email
        const adminEmails = ['admin@mindease.com', 'admin@mind.com', 'devansh@mindease.com', 'jasica@kaur.com', 'devansh@gupta.com'];
        setIsAdmin(adminEmails.includes(user.email.toLowerCase()));
      } else {
        // User logged out, but keep anonymous ID
        const existingUserId = localStorage.getItem('mindease_user_id');
        if (existingUserId) {
          setUserId(existingUserId);
        }
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userId,
    isAdmin,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
