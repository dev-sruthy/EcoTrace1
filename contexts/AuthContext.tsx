
import React, { useState, useEffect, createContext, useContext } from 'react';
import { type User, type AuthContextType, type AuthProviderProps } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecotrace_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (email && password.length >= 6) {
      const userData: User = { 
        uid: Date.now().toString(), 
        email, 
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('ecotrace_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (email: string, password: string, name: string) => {
    if (email && password.length >= 6 && name) {
      const userData: User = { 
        uid: Date.now().toString(), 
        email, 
        name,
        createdAt: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('ecotrace_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Please fill all fields correctly' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecotrace_user');
  };

  const value = { user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
