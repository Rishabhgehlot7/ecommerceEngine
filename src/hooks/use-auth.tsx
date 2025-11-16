
'use client';

import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { 
    login as loginAction, 
    signup as signupAction, 
    getUserFromSession, 
    clearUserSession, 
    signupWithPhone as signupWithPhoneAction,
    loginWithPhone as loginWithPhoneAction
} from '@/lib/actions/user.actions';
import type { IUser } from '@/models/User';
import { cookies } from 'next/dist/client/components/hooks-server-context';

// A simplified user object for the client-side context
export type ClientUser = Omit<IUser, 'password' | 'addresses'> & {
  id: string;
  displayName: string;
  avatar?: string;
  addresses: IUser['addresses'];
};

export interface AuthContextType {
  user: ClientUser | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  signupWithPhone: (data: {firstName: string, lastName: string, phone: string, password: string}) => Promise<void>;
  loginWithPhone: (data: {phone: string, password: string}) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function getSessionUser() {
  // This is a client component, so we can't use server-side `cookies()` directly.
  // The server action `getUserFromSession` is the correct way to handle this,
  // but it needs to be called in an async context.
  try {
    const sessionUser = await getUserFromSession(document.cookie.split('; ').find(row => row.startsWith('session_token='))?.split('=')[1]);
    return sessionUser;
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
  const refreshUser = useCallback(async () => {
     setIsUserLoading(true);
      const sessionUser = await getSessionUser();
      if (sessionUser) {
           const clientUser: ClientUser = {
              ...JSON.parse(JSON.stringify(sessionUser)),
              id: sessionUser._id,
              displayName: `${sessionUser.firstName} ${sessionUser.lastName}`,
              avatar: sessionUser.avatar,
              addresses: sessionUser.addresses || [],
          };
          setUser(clientUser);
      } else {
          setUser(null);
      }
      setIsUserLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);


  const login = useCallback(async (email: string, password: string) => {
    await loginAction({ email, password });
    await refreshUser();
  }, [refreshUser]);

  const signup = useCallback(async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      await signupAction({ firstName, lastName, email, password });
      await refreshUser();
    },
    [refreshUser]
  );
  
  const signupWithPhone = useCallback(async (data: {firstName: string, lastName: string, phone: string, password: string}) => {
    await signupWithPhoneAction(data);
    await refreshUser();
  }, [refreshUser]);
  
  const loginWithPhone = useCallback(async (data: {phone: string, password: string}) => {
      await loginWithPhoneAction(data);
      await refreshUser();
  }, [refreshUser]);


  const logout = useCallback(async () => {
    await clearUserSession();
    setUser(null);
    router.push('/');
  }, [router]);

  const value = {
    user,
    isUserLoading,
    login,
    signup,
    signupWithPhone,
    loginWithPhone,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
