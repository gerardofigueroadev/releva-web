'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from './types';

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const stored = localStorage.getItem('auth_user');
    if (token && stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  function login(token: string, user: AuthUser) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
