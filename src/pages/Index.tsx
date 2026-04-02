import { useState, useMemo, useEffect } from "react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import UserProfileView from "@/components/UserProfileView";
import PublishModal from "@/components/PublishModal";
import NotificationsPanel from "@/components/NotificationsPanel";
import ChatPanel from "@/components/ChatPanel";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import SavedItems from "@/components/SavedItems";
import TruequeProposal from "@/components/TruequeProposal";
import RegionFilter from "@/components/RegionFilter";
import PricingModal from "@/components/PricingModal";
import BoostModal from "@/components/BoostModal";
import SponsoredCard, { sponsoredAds } from "@/components/SponsoredCard";
import { mockProducts, mockUsers } from "@/data/mockProducts";
import type { Product, UserProfile } from "@/data/mockProducts";
import { ArrowLeftRight, TrendingUp, Users, Search, Shield, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Panel = "notifications" | "chat" | "publish" | "saved" | "pricing" | null;

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [proposalProduct, setProposalProduct] = useState<Product | null>(null);
  const [boostProduct, setBoostProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [regionFilter, setRegionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [mobileSearch, setMobileSearch] = useState("");

  const toggleSaved = (id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      if (activeCategory !== "Todo" && p.category !== activeCategory) return false;
      if (regionFilter !== "all" && p.user.region !== regionFilter) return false;
      const q = (searchQuery || mobileSearch).toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.wantsInReturn.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activeCategory, regionFilter, searchQuery, mobileSearch]);

  // Sort: boosted first
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (a.boosted && !b.boosted) return -1;
      if (!a.boosted && b.boosted) return 1;
      return 0;
    });
  }, [filteredProducts]);

  const savedProducts = mockProducts.filter((p) => savedIds.has(p.id));

  const handleViewProfile = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedProduct(null);
      setSelectedUser(user);
    }
  };

  const handlePropose = (product: Product) => {
    setSelectedProduct(null);
    setProposalProduct(product);
  };

  const handleBoost = (product: Product) => {
    setSelectedProduct(null);
    setBoostProduct(product);
  };

  // Insert sponsored ads after every 3rd product
  const renderFeedItems = () => {
    const items: JSX.Element[] = [];
    let adIndex = 0;

    sortedProducts.forEach((product, i) => {
      items.push(
        <div
          key={`product-${product.id}`}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <ProductCard
            product={product}
            onClick={() => setSelectedProduct(product)}
            saved={savedIds.has(product.id)}
            onToggleSave={() => toggleSaved(product.id)}
          />
        </div>
      );

      // Insert ad after every 3rd product
      if ((i + 1) % 3 === 0 && adIndex < sponsoredAds.length) {
        const ad = sponsoredAds[adIndex];
        items.push(
          <div key={`ad-${ad.id}`} className="animate-fade-in" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
            <SponsoredCard ad={ad} />
          </div>
        );
        adIndex++;
      }
    });

    return items;
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader
        onPublish={() => setActivePanel("publish")}
        onNotifications={() => setActivePanel("notifications")}
        onChat={() => setActivePanel("chat")}
        onSaved={() => setActivePanel("saved")}
        onPricing={() => setActivePanel("pricing")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-20">
        <div className="container text-center space-y-6">
          <div className="inline-flex items-center gap-2 swap-badge text-sm mb-2">
            <ArrowLeftRight className="h-4 w-4" />
            Intercambia sin dinero
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Dale nueva vida a<br />
            <span className="text-primary">tus cosas</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            La comunidad de trueques más grande de Chile. Ofrece lo que ya no usas y encuentra lo que necesitas. 🇨🇱
          </p>

          <div className="flex justify-center md:hidden">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="¿Qué buscas intercambiar?"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="w-full rounded-full bg-card pl-10 pr-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-primary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 md:gap-8 pt-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">12.4k</strong> usuarios</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">3.850</strong> trueques</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">16</strong> regiones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">100%</strong> gratis</span>
            </div>
          </div>

          {/* Premium CTA banner */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-colors"
            onClick={() => setActivePanel("pricing")}
          >
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-foreground">
              <strong>TruequeYa Premium</strong> — Destaca tus publicaciones y consigue más trueques
            </span>
            <span className="text-xs text-amber-600 font-medium">Desde $4.990/mes →</span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container py-8 space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Categorías</h2>
          <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Publicaciones recientes
              {activeCategory !== "Todo" && (
                <span className="text-primary ml-2 text-base">· {activeCategory}</span>
              )}
            </h2>
            <RegionFilter value={regionFilter} onChange={setRegionFilter} />
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">No se encontraron artículos</p>
              <p className="text-sm text-muted-foreground">Prueba con otra categoría o región</p>
              <Button variant="outline" className="rounded-full mt-2" onClick={() => { setActiveCategory("Todo"); setRegionFilter("all"); setSearchQuery(""); setMobileSearch(""); }}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderFeedItems()}
            </div>
          )}
        </div>
      </main>

      {/* How it works */}
      <HowItWorks />

      {/* Footer */}
      <Footer />

      {/* Mobile FAB */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden z-40"
        onClick={() => setActivePanel("publish")}
      >
        <ArrowLeftRight className="h-6 w-6" />
      </Button>

      {/* Modals & Panels */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onViewProfile={handleViewProfile}
          onPropose={() => handlePropose(selectedProduct)}
          onBoost={() => handleBoost(selectedProduct)}
          saved={savedIds.has(selectedProduct.id)}
          onToggleSave={() => toggleSaved(selectedProduct.id)}
        />
      )}

      {selectedUser && (
        <UserProfileView
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
          onProductClick={(product) => {
            setSelectedUser(null);
            setSelectedProduct(product);
          }}
        />
      )}

      {activePanel === "publish" && <PublishModal onClose={() => setActivePanel(null)} />}
      {activePanel === "notifications" && <NotificationsPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "chat" && <ChatPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "pricing" && <PricingModal onClose={() => setActivePanel(null)} />}
      {activePanel === "saved" && (
        <SavedItems
          products={savedProducts}
          onClose={() => setActivePanel(null)}
          onProductClick={(product) => {
            setActivePanel(null);
            setSelectedProduct(product);
          }}
        />
      )}

      {proposalProduct && (
        <TruequeProposal product={proposalProduct} onClose={() => setProposalProduct(null)} />
      )}

      {boostProduct && (
        <BoostModal product={boostProduct} onClose={() => setBoostProduct(null)} />
      )}
    </div>
  );
};

export default Index;
