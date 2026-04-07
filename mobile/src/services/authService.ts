/**
 * Auth Service — Supabase
 */
import { supabase } from './supabase';

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const user = data.user;
  return {
    id: user.id,
    email: user.email || email,
    displayName: user.user_metadata?.display_name || email.split('@')[0],
  };
};

export const registerWithEmail = async (
  email: string,
  password: string,
  userData: { name: string; region: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: userData.name },
    },
  });

  if (error) throw new Error(error.message);
  const user = data.user;
  if (!user) throw new Error('Error al crear la cuenta');

  // The profiles trigger in Supabase auto-creates a row,
  // but we update it with region info
  await supabase.from('profiles').update({
    region: userData.region,
    location: userData.region, // Default location to region
  }).eq('id', user.id);

  return {
    id: user.id,
    email: user.email || email,
    displayName: userData.name,
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
