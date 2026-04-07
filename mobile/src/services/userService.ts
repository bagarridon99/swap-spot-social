/**
 * User Service — Supabase
 */
import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  location: string;
  region: string;
  avatarUrl?: string;
  rating: number;
  totalReviews: number;
  totalSwaps: number;
  createdAt?: string;
}

export interface UserStats {
  publishedCount: number;
  swapsCount: number;
  reviewsCount: number;
  rating: number;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name || 'Usuario',
    location: data.location || '',
    region: data.region || '',
    avatarUrl: data.avatar_url,
    rating: data.rating || 0,
    totalReviews: data.total_reviews || 0,
    totalSwaps: data.total_swaps || 0,
    createdAt: data.created_at,
  };
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  // Count published products
  const { count: publishedCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Count accepted proposals (completed swaps)
  const { count: swapsCount } = await supabase
    .from('proposals')
    .select('id', { count: 'exact', head: true })
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .eq('status', 'accepted');

  // Count reviews received
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('reviewed_id', userId);

  // Get average rating
  const { data: profile } = await supabase
    .from('profiles')
    .select('rating')
    .eq('id', userId)
    .single();

  return {
    publishedCount: publishedCount || 0,
    swapsCount: swapsCount || 0,
    reviewsCount: reviewsCount || 0,
    rating: profile?.rating || 0,
  };
};

export const updateProfile = async (userId: string, updates: {
  displayName?: string;
  location?: string;
  region?: string;
  avatarUrl?: string;
}) => {
  const payload: Record<string, any> = {};
  if (updates.displayName !== undefined) payload.display_name = updates.displayName;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.region !== undefined) payload.region = updates.region;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

  const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
  if (error) throw error;
};
