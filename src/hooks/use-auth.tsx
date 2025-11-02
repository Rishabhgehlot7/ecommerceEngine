"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useFirebase, useUser as useFirebaseUser } from '@/firebase';
import {
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  UserCredential,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isUserLoading: boolean;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const { user, isUserLoading } = useFirebaseUser();

  const createUserWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error("Firebase auth not available");
    return firebaseCreateUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
     if (!auth) throw new Error("Firebase auth not available");
    return firebaseSignInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    if (!auth) throw new Error("Firebase auth not available");
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isUserLoading, createUserWithEmailAndPassword, signInWithEmailAndPassword, logout }}>
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

// No longer need recaptcha verifier in window
declare global {
    interface Window {
        recaptchaVerifier?: any;
    }
}
