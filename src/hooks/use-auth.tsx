
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, getIdToken } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  isAdmin: boolean;
  adminLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  idToken: null,
  isAdmin: false,
  adminLoading: true
});

// This function will be used to pass the ID token to server actions.
// It must be in a separate file or passed down to avoid making the context a server component.
export const getAuthHeader = async (): Promise<HeadersInit> => {
    const user = auth.currentUser;
    if (!user) return {};
    const token = await user.getIdToken();
    return {
        'Authorization': `Bearer ${token}`
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        try {
          // Force token refresh to ensure we have the latest claims
          const token = await user.getIdToken(true);
          setIdToken(token);
          
          // Check admin status with retry logic
          setAdminLoading(true);
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData?.admin === true);
                break;
              } else {
                // If user document doesn't exist, create it with default values
                console.warn('User document not found, user may not have admin privileges');
                setIsAdmin(false);
                break;
              }
            } catch (error) {
              retryCount++;
              if (retryCount === maxRetries) {
                console.error('Error getting user data after retries:', error);
                setIsAdmin(false);
              } else {
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              }
            }
          }
        } catch (error) {
          console.error('Error getting user token:', error);
          setIsAdmin(false);
        } finally {
          setAdminLoading(false);
        }
      } else {
        setIdToken(null);
        setIsAdmin(false);
        setAdminLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, idToken, isAdmin, adminLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);