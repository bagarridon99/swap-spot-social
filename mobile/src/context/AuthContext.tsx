import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: { name: string; region: string }) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sessionToUser = (session: Session | null): AuthUser | null => {
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email || '',
    displayName: u.user_metadata?.display_name || u.email?.split('@')[0] || 'Usuario',
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Listen for auth state changes (persisted session)
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(sessionToUser(session));
      setIsLoading(false);
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(sessionToUser(session));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      setUser(sessionToUser(data.session));
    } catch (err: any) {
      const msg = err.message || 'Error al iniciar sesión';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, userData: { name: string; region: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: userData.name } },
        });
        if (authError) throw authError;

        // Update profile with region
        if (data.user) {
          await supabase.from('profiles').update({
            region: userData.region,
          }).eq('id', data.user.id);
        }

        // If email confirmation is required, user won't have a session yet
        if (data.session) {
          setUser(sessionToUser(data.session));
        } else {
          setError('¡Cuenta creada! Revisa tu correo para verificar tu cuenta antes de iniciar sesión.');
        }
      } catch (err: any) {
        setError(err.message || 'Error al crear la cuenta');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
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

export default AuthContext;
