'use client';

import type { User, Alert } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface AuthContextType {
  user: User | null;
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
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    setAlerts(prevAlerts => [alert, ...prevAlerts]);
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== alertId));
  }


  const value = { user, loading, alerts, addAlert, deleteAlert, login, logout, register, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
