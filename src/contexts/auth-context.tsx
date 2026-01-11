'use client';

import type { User, Alert } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { alerts as initialAlerts } from '@/lib/data';

// Mock users database
const MOCK_USERS: User[] = [
  { id: '1', name: 'Demo User', email: 'demo@gmail.com', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@gmail.com', role: 'admin' },
];

const MOCK_PASSWORDS: Record<string, string> = {
  'demo@gmail.com': 'demo@0123',
  'admin@gmail.com': 'admin@0426',
};

const ALERTS_STORAGE_KEY = 'alertnet-alerts';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  loading: boolean;
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  deleteAlert: (alertId: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  updateUser: (updatedInfo: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Effect for handling user authentication state
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('alertnet-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      sessionStorage.removeItem('alertnet-user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for loading and syncing alerts from localStorage
  useEffect(() => {
    const getAlertsFromStorage = () => {
      try {
        const storedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
        if (storedAlerts) {
          // Parse dates correctly from JSON
          const parsedAlerts: Alert[] = JSON.parse(storedAlerts).map((alert: any) => ({
            ...alert,
            timestamp: new Date(alert.timestamp),
          }));
          setAlerts(parsedAlerts);
        } else {
          // Initialize with default data if nothing is in storage
          localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(initialAlerts));
          setAlerts(initialAlerts);
        }
      } catch (error) {
        console.error('Failed to access or parse alerts from localStorage', error);
        setAlerts(initialAlerts);
      }
    };

    getAlertsFromStorage();

    // Listen for changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ALERTS_STORAGE_KEY && event.newValue) {
         const parsedAlerts: Alert[] = JSON.parse(event.newValue).map((alert: any) => ({
            ...alert,
            timestamp: new Date(alert.timestamp),
          }));
        setAlerts(parsedAlerts);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && MOCK_PASSWORDS[foundUser.email] === pass) {
      const userToStore = { ...foundUser };
      sessionStorage.setItem('alertnet-user', JSON.stringify(userToStore));
      setUser(userToStore);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('alertnet-user');
    setUser(null);
    router.push('/login');
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setLoading(false);
      return false; // User already exists
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      role: 'user',
    };
    // In a real app, you would save the new user to the database.
    // Here we just mock it for the session.
    sessionStorage.setItem('alertnet-user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    return true;
  };
  
  const updateUser = (updatedInfo: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedInfo };
      setUser(updatedUser);
      sessionStorage.setItem('alertnet-user', JSON.stringify(updatedUser));
    }
  };

  const addAlert = (alert: Alert) => {
     try {
      const currentAlerts = JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]') as Alert[];
      const newAlerts = [alert, ...currentAlerts];
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(newAlerts));
      // Update state for current tab
      setAlerts(newAlerts.map(a => ({...a, timestamp: new Date(a.timestamp)})));
    } catch (error) {
      console.error('Failed to add alert to localStorage', error);
    }
  };

  const deleteAlert = (alertId: string) => {
    try {
      const currentAlerts = JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]') as Alert[];
      const newAlerts = currentAlerts.filter(a => a.id !== alertId);
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(newAlerts));
       // Update state for current tab
      setAlerts(newAlerts.map(a => ({...a, timestamp: new Date(a.timestamp)})));
    } catch (error) {
        console.error('Failed to delete alert from localStorage', error);
    }
  }

  const value = { user, allUsers: MOCK_USERS, loading, alerts, addAlert, deleteAlert, login, logout, register, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
