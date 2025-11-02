"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// This is a mock user type. In a real app, this would be more detailed.
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
    uid: 'mock-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://i.pravatar.cc/150?u=test-user'
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user from a session
    setTimeout(() => {
        // To test the logged-out state, set this to null
        // setUser(MOCK_USER); 
        setUser(null);
        setIsUserLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsUserLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (password === 'password') {
                const loggedInUser: User = { ...MOCK_USER, email: email, displayName: email.split('@')[0] }
                setUser(loggedInUser);
                setIsUserLoading(false);
                resolve();
            } else {
                setIsUserLoading(false);
                reject(new Error('Invalid email or password'));
            }
        }, 1500);
    });
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
     setIsUserLoading(true);
     // Simulate API call
     return new Promise((resolve) => {
         setTimeout(() => {
            const newUser: User = { 
                uid: `mock-user-${Date.now()}`,
                email: email, 
                displayName: `${firstName} ${lastName}` 
            };
            setUser(newUser);
            setIsUserLoading(false);
            resolve();
         }, 1500);
     });
  };

  const logout = () => {
    setIsUserLoading(true);
    // Simulate API call
    setTimeout(() => {
        setUser(null);
        setIsUserLoading(false);
    }, 500);
  };

  return (
    <AuthContext.Provider value={{ user, isUserLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
