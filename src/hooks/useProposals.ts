import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { type Proposal } from "@/lib/database";
import { toast } from "sonner";

/**
 * Fetches ALL proposals where the user is either sender or receiver.
 * This enables showing full trade history (sent + received).
 */
const fetchAllProposals = async (userId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from("proposals")
    .select(`
      *,
      from_profile:from_user_id ( display_name ),
      to_profile:to_user_id ( display_name ),
      offered_product:offered_product_id ( title, image_url ),
      requested_product:requested_product_id ( title, image_url )
    `)
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d: any) => ({
    id: d.id,
    fromUserId: d.from_user_id,
    fromUserName: d.from_profile?.display_name || "Usuario",
    toUserId: d.to_user_id,
    toUserName: d.to_profile?.display_name || "Usuario",
    offeredProductId: d.offered_product_id,
    offeredProductTitle: d.offered_product?.title || "Producto",
    offeredProductImage: d.offered_product?.image_url || "",
    requestedProductId: d.requested_product_id,
    requestedProductTitle: d.requested_product?.title || "Producto",
    requestedProductImage: d.requested_product?.image_url || "",
    message: d.message,
    status: d.status,
    createdAt: d.created_at,
  }));
};

export const useProposals = (userId: string | undefined) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const prevIncomingLen = useRef<number>(0);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const data = await fetchAllProposals(userId);
      setProposals(data);
      setLoading(false);

      // Toast for new incoming proposals
      const incoming = data.filter((p) => p.toUserId === userId && p.status === "pending");
      if (prevIncomingLen.current > 0 && incoming.length > prevIncomingLen.current) {
        toast.info("¡Tienes una nueva propuesta de trueque pendiente!");
      }
      prevIncomingLen.current = incoming.length;
    };

    load();

    // Subscribe to changes on the proposals table for this user
    const channel = supabase
      .channel(`proposals:all:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposals" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Derived values
  const incomingProposals = proposals.filter((p) => p.toUserId === userId);
  const sentProposals = proposals.filter((p) => p.fromUserId === userId);
  const pendingCount = incomingProposals.filter((p) => p.status === "pending").length;

  return {
    proposals,
    incomingProposals,
    sentProposals,
    pendingCount,
    loading,
  };
};
