/**
 * Review Service — Supabase
 */
import { supabase } from './supabase';

export interface Review {
  id?: string;
  reviewerId: string;
  reviewedId: string;
  proposalId?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  reviewerName?: string;
}

export const submitReview = async (review: {
  reviewerId: string;
  reviewedId: string;
  proposalId: string;
  rating: number;
  comment?: string;
}): Promise<void> => {
  const { error } = await supabase.from('reviews').insert({
    reviewer_id: review.reviewerId,
    reviewed_id: review.reviewedId,
    proposal_id: review.proposalId,
    rating: review.rating,
    comment: review.comment || null,
  });
  if (error) throw error;
};

export const getReviewsForUser = async (userId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:reviewer_id ( display_name )
    `)
    .eq('reviewed_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((d: any) => ({
    id: d.id,
    reviewerId: d.reviewer_id,
    reviewedId: d.reviewed_id,
    proposalId: d.proposal_id,
    rating: d.rating,
    comment: d.comment,
    createdAt: d.created_at,
    reviewerName: d.reviewer?.display_name || 'Usuario',
  }));
};

export const hasReviewedProposal = async (
  reviewerId: string,
  proposalId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', reviewerId)
    .eq('proposal_id', proposalId)
    .maybeSingle();

  return !!data;
};
