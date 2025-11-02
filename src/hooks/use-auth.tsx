"use client";

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useFirebase, useUser as useFirebaseUser } from '@/firebase';
import {
  signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isUserLoading: boolean;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<ConfirmationResult>;
  confirmOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const { user, isUserLoading } = useFirebaseUser();

  useEffect(() => {
    // Check if the container exists and verifier is not already created.
    if (auth && !window.recaptchaVerifier && document.getElementById('recaptcha-container')) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
      // Render the verifier
      window.recaptchaVerifier.render();
    }
    // We only want to run this when `auth` is available, but not re-run it for other changes.
  }, [auth]);


  const signInWithPhoneNumber = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (!auth) throw new Error("Firebase auth not available");
    // Ensure verifier is ready before sign-in attempt
    if (!window.recaptchaVerifier) {
      throw new Error("RecaptchaVerifier not initialized.");
    }
    const appVerifier = window.recaptchaVerifier;
    return firebaseSignInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const confirmOtp = async (confirmationResult: ConfirmationResult, otp: string) => {
    await confirmationResult.confirm(otp);
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase auth not available");
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isUserLoading, signInWithPhoneNumber, confirmOtp, logout }}>
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

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
