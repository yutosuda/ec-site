'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/lib/data/user';
import { safeLocalStorage } from '@/lib/utils/initializeAppData';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component that manages user auth state
 * Uses localStorage for user persistence as specified in SECTION_ID: 3.7
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUserId = safeLocalStorage.getItem('KEM_MOCK_CURRENT_USER_ID');
    if (storedUserId) {
      const usersJson = safeLocalStorage.getItem('KEM_MOCK_USERS');
      if (usersJson) {
        try {
          const users: UserProfile[] = JSON.parse(usersJson);
          const foundUser = users.find(user => user.id === storedUserId);
          if (foundUser) {
            setCurrentUser(foundUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Failed to parse users from localStorage', error);
        }
      }
    }
  }, []);

  /**
   * Authenticates user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Object indicating success and optional error message
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Get users from localStorage
    const usersJson = safeLocalStorage.getItem('KEM_MOCK_USERS');
    if (!usersJson) {
      return { success: false, error: 'No users found' };
    }

    try {
      const users: any[] = JSON.parse(usersJson);
      // Note: In real implementation, we would hash and compare passwords
      // For this mock, we'll assume password is stored in plain text
      const foundUser = users.find(user => user.email === email && user.password === password);
      
      if (foundUser) {
        // Convert dates back to Date objects
        const userProfile: UserProfile = {
          ...foundUser,
          createdAt: new Date(foundUser.createdAt),
          updatedAt: new Date(foundUser.updatedAt)
        };
        delete userProfile.password;
        
        setCurrentUser(userProfile);
        setIsAuthenticated(true);
        safeLocalStorage.setItem('KEM_MOCK_CURRENT_USER_ID', userProfile.id);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  /**
   * Registers a new user
   * @param email - User email
   * @param password - User password
   * @returns Object indicating success and optional error message
   */
  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Get existing users
    const usersJson = safeLocalStorage.getItem('KEM_MOCK_USERS');
    let users: any[] = [];
    
    if (usersJson) {
      try {
        users = JSON.parse(usersJson);
      } catch (error) {
        console.error('Failed to parse users from localStorage', error);
      }
    }

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    // Create new user
    const now = new Date();
    const newUser = {
      id: `user-${String(users.length + 1).padStart(3, '0')}`,
      name: email.split('@')[0], // Default name from email
      email,
      password, // In a real app, we would hash this
      createdAt: now,
      updatedAt: now
    };

    // Add to users array and save
    users.push(newUser);
    safeLocalStorage.setItem('KEM_MOCK_USERS', JSON.stringify(users));
    
    // Auto login (remove password from user object for currentUser state)
    const userProfile: UserProfile = { ...newUser };
    delete userProfile.password;
    
    setCurrentUser(userProfile);
    setIsAuthenticated(true);
    safeLocalStorage.setItem('KEM_MOCK_CURRENT_USER_ID', newUser.id);
    
    return { success: true };
  };

  /**
   * Logs out the current user
   */
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem('KEM_MOCK_CURRENT_USER_ID');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns Auth context value
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 