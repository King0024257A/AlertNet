'use client';

import type { User, Alert } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { alerts as initialAlerts } from '@/lib/data';

// --- Persistent Storage Keys ---
const USERS_STORAGE_KEY = 'alertnet-users';
const PASSWORDS_STORAGE_KEY = 'alertnet-passwords';
const ALERTS_STORAGE_KEY = 'alertnet-alerts';
const SESSION_USER_KEY = 'alertnet-user';

// --- Initial Mock Data (used to seed localStorage if empty) ---
const INITIAL_MOCK_USERS: User[] = [
  { id: '1', name: 'Demo User', email: 'demo@gmail.com', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@gmail.com', role: 'admin' },
];

const INITIAL_MOCK_PASSWORDS: Record<string, string> = {
  'demo@gmail.com': 'demo@0123',
  'admin@gmail.com': 'admin@0426',
};

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
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Effect for initializing and syncing all data from localStorage
  useEffect(() => {
    try {
      // --- Initialize Users ---
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      } else {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
        setAllUsers(INITIAL_MOCK_USERS);
      }

      // --- Initialize Passwords ---
      const storedPasswords = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (!storedPasswords) {
        localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PASSWORDS));
      }
      
      // --- Initialize Alerts ---
      const storedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (storedAlerts) {
        const parsedAlerts: Alert[] = JSON.parse(storedAlerts).map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
        }));
        setAlerts(parsedAlerts);
      } else {
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(initialAlerts));
        setAlerts(initialAlerts);
      }
      
      // --- Restore Logged-in User from Session ---
      const sessionUser = sessionStorage.getItem(SESSION_USER_KEY);
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }

    } catch (error) {
      console.error('Failed to initialize from localStorage', error);
      // Fallback to initial data if localStorage is corrupt
      setAllUsers(INITIAL_MOCK_USERS);
      setAlerts(initialAlerts);
    } finally {
      setLoading(false);
    }

    // --- Add storage listener to sync across tabs ---
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ALERTS_STORAGE_KEY && event.newValue) {
        const parsedAlerts: Alert[] = JSON.parse(event.newValue).map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
        }));
        setAlerts(parsedAlerts);
      }
      if (event.key === USERS_STORAGE_KEY && event.newValue) {
        setAllUsers(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const users: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const passwords: Record<string, string> = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || '{}');
      
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && passwords[foundUser.email] === pass) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_USER_KEY);
    setUser(null);
    router.push('/login');
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const users: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const passwords: Record<string, string> = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || '{}');
      
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User = {
        id: String(Date.now()), // More robust ID
        name,
        email,
        role: 'user',
      };
      
      const updatedUsers = [...users, newUser];
      const updatedPasswords = { ...passwords, [email]: pass };
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(updatedPasswords));
      setAllUsers(updatedUsers);

      // Automatically log in the new user
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUser = (updatedInfo: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedInfo };
      
      // Update the master user list in localStorage
      const users: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        setAllUsers(users);
      }
      
      // Update the current session
      setUser(updatedUser);
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const addAlert = (alert: Alert) => {
     try {
      const currentAlerts = JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]') as Alert[];
      const newAlerts = [alert, ...currentAlerts];
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(newAlerts));
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
      setAlerts(newAlerts.map(a => ({...a, timestamp: new Date(a.timestamp)})));
    } catch (error) {
        console.error('Failed to delete alert from localStorage', error);
    }
  }

  const value = { user, allUsers, loading, alerts, addAlert, deleteAlert, login, logout, register, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
