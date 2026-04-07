/**
 * Proposal Service — Supabase
 */
import { supabase } from './supabase';

export interface Proposal {
  id?: string;
  fromUserId: string;
  fromUserName?: string;
  toUserId: string;
  toUserName?: string;
  offeredProductId: string;
  offeredProductTitle?: string;
  offeredProductImage?: string;
  requestedProductId: string;
  requestedProductTitle?: string;
  requestedProductImage?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt?: string;
}

const mapProposal = (d: any): Proposal => ({
  id: d.id,
  fromUserId: d.from_user_id,
  fromUserName: d.from_profile?.display_name || 'Usuario',
  toUserId: d.to_user_id,
  toUserName: d.to_profile?.display_name || 'Usuario',
  offeredProductId: d.offered_product_id,
  offeredProductTitle: d.offered_product?.title || 'Producto',
  offeredProductImage: d.offered_product?.image_url || '',
  requestedProductId: d.requested_product_id,
  requestedProductTitle: d.requested_product?.title || 'Producto',
  requestedProductImage: d.requested_product?.image_url || '',
  message: d.message,
  status: d.status,
  createdAt: d.created_at,
});

export const sendProposal = async (proposal: {
  fromUserId: string;
  toUserId: string;
  offeredProductId: string;
  requestedProductId: string;
  message?: string;
}): Promise<string> => {
  const { data, error } = await supabase.from('proposals').insert({
    from_user_id: proposal.fromUserId,
    to_user_id: proposal.toUserId,
    offered_product_id: proposal.offeredProductId,
    requested_product_id: proposal.requestedProductId,
    message: proposal.message || '',
    status: 'pending',
  }).select('id').single();

  if (error) throw error;
  return data.id;
};

export const getProposals = async (userId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      from_profile:from_user_id ( display_name ),
      to_profile:to_user_id ( display_name ),
      offered_product:offered_product_id ( title, image_url ),
      requested_product:requested_product_id ( title, image_url )
    `)
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProposal);
};

export const updateProposalStatus = async (
  proposalId: string,
  status: 'accepted' | 'rejected' | 'cancelled'
): Promise<void> => {
  const { error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', proposalId);

  if (error) throw error;
};

export const subscribeProposals = (
  userId: string,
  onUpdate: (proposals: Proposal[]) => void
) => {
  getProposals(userId).then(onUpdate).catch(console.error);

  const channel = supabase
    .channel(`proposals:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, () => {
      getProposals(userId).then(onUpdate).catch(console.error);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};
