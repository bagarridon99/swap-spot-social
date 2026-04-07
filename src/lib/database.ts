import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BaseProduct {
  id?: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  wantsInReturn: string;
  acceptableItems: string[];
  imageUrl: string;
  /** All image URLs (parsed from JSON array stored in image_url column) */
  imageUrls: string[];
  region: string;
  location: string;
  userId: string;
  userName?: string;
  userInitials?: string;
  boosted?: boolean;
  createdAt?: any;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  text: string;
  createdAt?: string;
}

export interface Chat {
  id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadBy?: string[];
  
  participantNames?: Record<string, string>;
  participantInitials?: Record<string, string>;
}

export interface Proposal {
  id?: string;
  fromUserId: string;
  toUserId: string;
  offeredProductId: string;
  requestedProductId: string;
  message: string;
  status?: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt?: string;
  
  // Virtual properties mapped from Supabase joins
  fromUserName?: string;
  toUserName?: string;
  offeredProductTitle?: string;
  offeredProductImage?: string;
  requestedProductTitle?: string;
  requestedProductImage?: string;
}

// Keep the old name for backward compatibility during migration
export interface FirestoreProduct extends BaseProduct {}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse image_url column: supports JSON array string or plain URL (backward compat) */
const parseImageUrls = (raw: string | null | undefined): string[] => {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) return arr.filter((u: any) => typeof u === "string" && u.length > 0);
    } catch {
      // fall through to plain URL
    }
  }
  return [trimmed];
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const subscribeProducts = (
  callback: (products: FirestoreProduct[]) => void
) => {
  const fetchProducts = async () => {
    // Select product and join profile for name
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        profiles:user_id ( display_name )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((d: any) => {
        const urls = parseImageUrls(d.image_url);
        return {
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category,
          condition: d.condition,
          wantsInReturn: d.wants_in_return,
          acceptableItems: d.acceptable_items,
          imageUrl: urls[0] || "",
          imageUrls: urls,
          region: d.region,
          location: d.location,
          userId: d.user_id,
          userName: d.profiles?.display_name || "Usuario",
          userInitials: (d.profiles?.display_name || "US").substring(0, 2).toUpperCase(),
          boosted: d.boosted,
          createdAt: d.created_at,
        };
      });
      callback(formatted);
    }
  };

  fetchProducts();

  const channel = supabase
    .channel("public:products")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      () => {
        fetchProducts();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const addProduct = async (
  product: Omit<FirestoreProduct, "id" | "createdAt" | "userName" | "userInitials">
) => {
  // Serialize image URLs as JSON array into the single image_url TEXT column
  const serializedImageUrl =
    product.imageUrls.length > 0
      ? JSON.stringify(product.imageUrls)
      : product.imageUrl;

  const { error } = await supabase.from("products").insert({
    title: product.title,
    description: product.description,
    category: product.category,
    condition: product.condition,
    wants_in_return: product.wantsInReturn,
    acceptable_items: product.acceptableItems,
    image_url: serializedImageUrl,
    region: product.region,
    location: product.location,
    user_id: product.userId,
    boosted: false,
  });
  if (error) throw error;
};

export const boostProduct = async (productId: string) => {
  const { error } = await supabase
    .from("products")
    .update({ boosted: true })
    .eq("id", productId);
  if (error) throw error;
};

// ─── Image Upload ──────────────────────────────────────────────────────────────

export const uploadProductImage = async (
  file: File,
  userId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout subiendo imagen a Supabase Storage.")), 15000)
  );

  const uploadProcess = async () => {
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  return Promise.race([uploadProcess(), timeoutPromise]);
};

/** Upload multiple images in parallel and return array of public URLs */
export const uploadMultipleProductImages = async (
  files: File[],
  userId: string
): Promise<string[]> => {
  return Promise.all(files.map((file) => uploadProductImage(file, userId)));
};

// ─── Chats ────────────────────────────────────────────────────────────────────

export const subscribeChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  const fetchChats = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .contains("participants", [userId])
      .order("last_message_at", { ascending: false });

    if (!error && data) {
      const mappedChats: Chat[] = data.map((c: any) => ({
        id: c.id,
        participants: c.participants,
        lastMessage: c.last_message,
        lastMessageAt: c.last_message_at,
        unreadBy: c.unread_by,
      }));
      callback(mappedChats);
    }
  };

  fetchChats();

  const channel = supabase
    .channel("public:chats")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "chats" },
      () => fetchChats()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeMessages = (
  chatId: string,
  callback: (messages: any[]) => void
) => {
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Map to frontend expected names
      const mapped = data.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        text: m.text,
        createdAt: m.created_at
      }));
      callback(mapped);
    }
  };

  fetchMessages();

  const channel = supabase
    .channel(`messages:${chatId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
      () => fetchMessages()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  otherUserId: string
) => {
  const { error: msgError } = await supabase.from("messages").insert({
    chat_id: chatId,
    sender_id: senderId,
    text: text,
  });
  
  if (msgError) throw msgError;

  // Retrieve unread by array to append
  const { data: chatData } = await supabase
    .from("chats")
    .select("unread_by")
    .eq("id", chatId)
    .single();

  const currentUnread = chatData?.unread_by || [];
  if (!currentUnread.includes(otherUserId)) {
    currentUnread.push(otherUserId);
  }

  await supabase
    .from("chats")
    .update({
      last_message: text,
      last_message_at: new Date().toISOString(),
      unread_by: currentUnread,
    })
    .eq("id", chatId);
};

export const markChatRead = async (chatId: string, userId: string) => {
  const { data: chatData } = await supabase
    .from("chats")
    .select("unread_by")
    .eq("id", chatId)
    .single();

  if (!chatData) return;
  const unreadBy = (chatData.unread_by || []).filter((id: string) => id !== userId);
  await supabase.from("chats").update({ unread_by: unreadBy }).eq("id", chatId);
};

export const createOrGetChat = async (
  userId1: string,
  name1: string,
  initials1: string,
  userId2: string,
  name2: string,
  initials2: string
): Promise<string> => {
  // Check if chat already exists
  const { data: existing } = await supabase
    .from("chats")
    .select("id")
    .contains("participants", [userId1, userId2]);

  if (existing && existing.length > 0) return existing[0].id;

  // Create new chat
  const { data: newChat, error } = await supabase
    .from("chats")
    .insert({
      participants: [userId1, userId2],
      unread_by: [],
    })
    .select("id")
    .single();

  if (error) throw error;
  return newChat.id;
};

// ─── Proposals ────────────────────────────────────────────────────────────────

export const sendProposal = async (
  proposal: Omit<Proposal, "id" | "createdAt" | "status">,
  offeredProductTitle?: string,
  fromUserName?: string
) => {
  const { error } = await supabase.from("proposals").insert({
    from_user_id: proposal.fromUserId,
    to_user_id: proposal.toUserId,
    offered_product_id: proposal.offeredProductId,
    requested_product_id: proposal.requestedProductId,
    message: proposal.message,
    status: "pending",
  });
  if (error) throw error;

  // Invocar Edge Function para disparar el correo electrónico al receptor (no arroja error para no romper la app si falla el correo)
  if (offeredProductTitle && fromUserName) {
    supabase.functions.invoke("quick-api", {
      body: { 
        toUserId: proposal.toUserId,
        fromUserName: fromUserName || "Alguien", 
        offeredProductTitle: offeredProductTitle || "un artículo suyo"
      }
    }).catch(console.error);
  }
};

export const subscribeProposals = (
  userId: string,
  callback: (proposals: Proposal[]) => void
) => {
  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from("proposals")
      .select(`
        *,
        from_profile:from_user_id ( display_name ),
        to_profile:to_user_id ( display_name ),
        offered_product:offered_product_id ( title, image_url ),
        requested_product:requested_product_id ( title, image_url )
      `)
      .eq("to_user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((d: any) => ({
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
      callback(formatted);
    }
  };

  fetchProposals();

  const channel = supabase
    .channel(`proposals:${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "proposals", filter: `to_user_id=eq.${userId}` },
      () => fetchProposals()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const updateProposalStatus = async (
  proposalId: string,
  status: "accepted" | "rejected" | "cancelled"
) => {
  const { error } = await supabase.from("proposals").update({ status }).eq("id", proposalId);
  if (error) throw error;
};

// ─── Delete Product ────────────────────────────────────────────────────────────

export const deleteProduct = async (productId: string) => {
  // First delete the image from storage if needed
  const { data: product } = await supabase
    .from("products")
    .select("image_url, user_id")
    .eq("id", productId)
    .single();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;

  // Try to clean up the storage file (best-effort, don't fail if it doesn't work)
  if (product?.image_url) {
    try {
      const url = new URL(product.image_url);
      const pathParts = url.pathname.split("/storage/v1/object/public/products/");
      if (pathParts[1]) {
        await supabase.storage.from("products").remove([decodeURIComponent(pathParts[1])]);
      }
    } catch {
      // ignore storage cleanup errors
    }
  }
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

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
}) => {
  const { error } = await supabase.from("reviews").insert({
    reviewer_id: review.reviewerId,
    reviewed_id: review.reviewedId,
    proposal_id: review.proposalId,
    rating: review.rating,
    comment: review.comment || null,
  });
  if (error) throw error;
};

export const fetchReviewsForUser = async (userId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id ( display_name )
    `)
    .eq("reviewed_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d: any) => ({
    id: d.id,
    reviewerId: d.reviewer_id,
    reviewedId: d.reviewed_id,
    proposalId: d.proposal_id,
    rating: d.rating,
    comment: d.comment,
    createdAt: d.created_at,
    reviewerName: d.reviewer?.display_name || "Usuario",
  }));
};

export const hasReviewedProposal = async (
  reviewerId: string,
  proposalId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("reviewer_id", reviewerId)
    .eq("proposal_id", proposalId)
    .maybeSingle();

  return !!data;
};

// ─── Saved Items (Supabase) ───────────────────────────────────────────────────

export const fetchSavedIds = async (userId: string): Promise<Set<string>> => {
  const { data, error } = await supabase
    .from("saved_items")
    .select("product_id")
    .eq("user_id", userId);

  if (error || !data) return new Set();
  return new Set(data.map((d: any) => d.product_id));
};

export const toggleSavedItem = async (
  userId: string,
  productId: string,
  currentlySaved: boolean
) => {
  if (currentlySaved) {
    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("saved_items")
      .insert({ user_id: userId, product_id: productId });
    if (error) throw error;
  }
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileUpdate {
  displayName?: string;
  location?: string;
  region?: string;
  avatarUrl?: string;
}

export const updateProfile = async (userId: string, updates: ProfileUpdate) => {
  // Backend validation: enforce 50-char limit on display name
  if (updates.displayName !== undefined && updates.displayName.length > 50) {
    throw new Error("El nombre de usuario no puede superar los 50 caracteres.");
  }

  const payload: Record<string, any> = {};
  if (updates.displayName !== undefined) payload.display_name = updates.displayName;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.region !== undefined) payload.region = updates.region;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId);

  if (error) throw error;
};

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};
