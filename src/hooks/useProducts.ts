import { useState, useMemo, useEffect } from "react";
import { subscribeProducts, type FirestoreProduct } from "@/lib/database";

interface UseProductsOptions {
  activeCategory: string;
  regionFilter: string;
  comunaFilter: string;
  searchQuery: string;
  mobileSearch: string;
}

export const useProducts = ({
  activeCategory,
  regionFilter,
  comunaFilter,
  searchQuery,
  mobileSearch,
}: UseProductsOptions) => {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== "Todo" && p.category !== activeCategory) return false;
      if (regionFilter !== "all" && p.region !== regionFilter) return false;
      if (comunaFilter !== "all" && p.location !== comunaFilter) return false;
      const q = (searchQuery || mobileSearch).toLowerCase();
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q) &&
        !p.wantsInReturn.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [products, activeCategory, regionFilter, comunaFilter, searchQuery, mobileSearch]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (a.boosted && !b.boosted) return -1;
      if (!a.boosted && b.boosted) return 1;
      return 0;
    });
  }, [filteredProducts]);

  return { products, sortedProducts, loading };
};
