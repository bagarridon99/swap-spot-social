/**
 * Product Service — Supabase
 */
import { supabase } from './supabase';

export interface SupabaseProduct {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  condition: string;
  wantsInReturn: string;
  acceptableItems: string[];
  location: string;
  region: string;
  userId: string;
  userName?: string;
  userInitials?: string;
  boosted?: boolean;
  createdAt?: string;
}

const mapProduct = (row: any): SupabaseProduct => ({
  id: row.id,
  title: row.title,
  description: row.description,
  imageUrl: row.image_url || '',
  category: row.category,
  condition: row.condition,
  wantsInReturn: row.wants_in_return || '',
  acceptableItems: row.acceptable_items || [],
  location: row.location || '',
  region: row.region || '',
  userId: row.user_id,
  userName: row.user_name || '',
  userInitials: row.user_initials || '',
  boosted: row.boosted || false,
  createdAt: row.created_at,
});

export const getProducts = async (category?: string): Promise<SupabaseProduct[]> => {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (category && category !== 'Todo') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapProduct);
};

export const getProductById = async (id: string): Promise<SupabaseProduct | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapProduct(data);
};

export const searchProducts = async (searchQuery: string): Promise<SupabaseProduct[]> => {
  const products = await getProducts();
  const q = searchQuery.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};

export const createProduct = async (product: {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  condition: string;
  wantsInReturn: string;
  acceptableItems: string[];
  location: string;
  region: string;
  userId: string;
  userName: string;
  userInitials: string;
}): Promise<string> => {
  const { data, error } = await supabase.from('products').insert({
    title: product.title,
    description: product.description,
    image_url: product.imageUrl,
    category: product.category,
    condition: product.condition,
    wants_in_return: product.wantsInReturn,
    acceptable_items: product.acceptableItems,
    location: product.location,
    region: product.region,
    user_id: product.userId,
    user_name: product.userName,
    user_initials: product.userInitials,
  }).select('id').single();

  if (error) throw error;
  return data.id;
};

export const getUserProducts = async (userId: string): Promise<SupabaseProduct[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProduct);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
};

export const subscribeProducts = (onUpdate: (products: SupabaseProduct[]) => void) => {
  // Initial fetch
  getProducts().then(onUpdate).catch(console.error);

  // Real-time updates
  const channel = supabase
    .channel('products-mobile')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
      getProducts().then(onUpdate).catch(console.error);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};
