import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accountType: 'rent' | 'list' | 'both';
  idVerified: boolean;
  emailVerified: boolean;
  profileComplete: boolean;
  rating: number;
  totalRentals: number;
  totalListings: number;
  role?: 'user' | 'admin';
  isAdmin?: boolean;
  profilePicture?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    accountType: 'rent' | 'list' | 'both';
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.user) {
        setCurrentUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    if (response.success && response.user) {
      setCurrentUser(response.user);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    accountType: 'rent' | 'list' | 'both';
  }) => {
    const response = await authAPI.register(userData);
    if (response.success && response.user) {
      setCurrentUser(response.user);
    }
  };

  const logout = async () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const response = await authAPI.updateProfile(updates);
    if (response.success && response.user) {
      setCurrentUser(response.user);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
