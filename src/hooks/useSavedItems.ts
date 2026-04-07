import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSavedIds, toggleSavedItem } from "@/lib/database";
import type { FirestoreProduct } from "@/lib/database";

export const useSavedItems = (products: FirestoreProduct[]) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load saved items from Supabase on mount
  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchSavedIds(user.id)
      .then((ids) => setSavedIds(ids))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const toggleSaved = useCallback(
    async (productId: string) => {
      if (!user) return;

      const currentlySaved = savedIds.has(productId);

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.delete(productId);
        else next.add(productId);
        return next;
      });

      // Persist to Supabase
      try {
        await toggleSavedItem(user.id, productId, currentlySaved);
      } catch (err) {
        // Revert optimistic update on failure
        console.error("Error toggling saved item:", err);
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (currentlySaved) next.add(productId);
          else next.delete(productId);
          return next;
        });
      }
    },
    [user, savedIds]
  );

  const savedProducts = useMemo(
    () => products.filter((p) => savedIds.has(p.id!)),
    [products, savedIds]
  );

  return { savedIds, toggleSaved, savedProducts, loading };
};
