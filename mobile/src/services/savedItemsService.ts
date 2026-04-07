/**
 * Saved Items Service — Supabase
 */
import { supabase } from './supabase';

export const fetchSavedIds = async (userId: string): Promise<Set<string>> => {
  const { data, error } = await supabase
    .from('saved_items')
    .select('product_id')
    .eq('user_id', userId);

  if (error || !data) return new Set();
  return new Set(data.map((d: any) => d.product_id));
};

export const toggleSavedItem = async (
  userId: string,
  productId: string,
  currentlySaved: boolean
): Promise<void> => {
  if (currentlySaved) {
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('saved_items')
      .insert({ user_id: userId, product_id: productId });
    if (error) throw error;
  }
};
