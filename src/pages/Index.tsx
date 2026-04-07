import { useState, useMemo, useEffect } from "react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import CategoryFilter from "@/components/CategoryFilter";
import ProductDetailModal from "@/components/ProductDetailModal";
import ProductFeed from "@/components/ProductFeed";
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
import SettingsPanel from "@/components/SettingsPanel";
import DiscoverMode from "@/components/DiscoverMode";
import TradeHistory from "@/components/TradeHistory";
import MapExplorer from "@/components/MapExplorer";
import TradeEvents from "@/components/TradeEvents";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useProposals } from "@/hooks/useProposals";
import { useSavedItems } from "@/hooks/useSavedItems";
import { usePanelManager } from "@/hooks/usePanelManager";
import { deleteProduct, type FirestoreProduct } from "@/lib/database";
import { ArrowLeftRight, Users, Search, Shield, MapPin, Crown, Compass, History, Map, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Panel } from "@/hooks/usePanelManager";

const Index = () => {
  const { user } = useAuth();
  const { activePanel, openPanel, closePanel } = usePanelManager();

  // Filters
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [regionFilter, setRegionFilter] = useState("all");
  const [comunaFilter, setComunaFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");

  // Products
  const { products, sortedProducts, loading: productsLoading } = useProducts({
    activeCategory,
    regionFilter,
    comunaFilter,
    searchQuery,
    mobileSearch,
  });

  // Proposals
  const { incomingProposals, pendingCount, loading: notifLoading } = useProposals(user?.id);

  // Saved items (persisted to localStorage)
  const { savedIds, toggleSaved, savedProducts } = useSavedItems(products);

  // Product detail & proposal flow
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);
  const [proposalProduct, setProposalProduct] = useState<FirestoreProduct | null>(null);
  const [boostProduct, setBoostProduct] = useState<FirestoreProduct | null>(null);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("truequeya-dark") === "1";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("truequeya-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Derived
  const myProducts = useMemo(() => {
    return products.filter((p) => p.userId === user?.id);
  }, [products, user]);

  const handlePropose = (product: FirestoreProduct) => {
    setSelectedProduct(null);
    setProposalProduct(product);
  };

  const handleDeleteProduct = async (product: FirestoreProduct) => {
    if (!product.id) return;
    if (!window.confirm(`¿Eliminar "${product.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(product.id);
      setSelectedProduct(null);
      toast.success("Publicación eliminada");
    } catch (err: any) {
      console.error(err);
      toast.error("Error al eliminar la publicación");
    }
  };

  const clearFilters = () => {
    setActiveCategory("Todo");
    setRegionFilter("all");
    setComunaFilter("all");
    setSearchQuery("");
    setMobileSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader
        onPublish={() => openPanel("publish")}
        onNotifications={() => openPanel("notifications")}
        onChat={() => openPanel("chat")}
        onSaved={() => openPanel("saved")}
        onPricing={() => openPanel("pricing")}
        onSettings={() => openPanel("settings")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadNotifications={pendingCount}
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
              <span><strong className="text-foreground">{products.length}</strong> publicaciones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">{new Set(products.map((p) => p.region)).size}</strong> regiones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">100%</strong> gratis</span>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-colors"
            onClick={() => openPanel("pricing")}
          >
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-foreground">
              <strong>TruequeYa Premium</strong> — Destaca tus publicaciones y consigue más trueques
            </span>
            <span className="text-xs text-amber-600 font-medium">Desde $4.990/mes →</span>
          </div>
        </div>
      </section>

      {/* Quick access bar */}
      <div className="container pt-8 pb-2">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { icon: Compass, label: "Descubrir", panel: "discover" as Panel, color: "text-primary" },
            { icon: Map, label: "Mapa", panel: "map" as Panel, color: "text-primary" },
            { icon: History, label: "Historial", panel: "history" as Panel, color: "text-primary" },
            { icon: CalendarDays, label: "Eventos", panel: "events" as Panel, color: "text-primary" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => openPanel(item.panel)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border hover:bg-secondary/50 transition-colors whitespace-nowrap"
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="container py-4 space-y-8">
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
            <RegionFilter value={regionFilter} onChange={setRegionFilter} comunaValue={comunaFilter} onComunaChange={setComunaFilter} />
          </div>

          {productsLoading ? (
            // Skeleton loading state
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="flex justify-between">
                      <div className="h-6 w-6 bg-muted rounded-full" />
                      <div className="h-3 bg-muted rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {products.length === 0 ? "Aún no hay publicaciones" : "No se encontraron artículos"}
              </p>
              <p className="text-sm text-muted-foreground">
                {products.length === 0 ? "¡Sé el primero en publicar!" : "Prueba con otra categoría o región"}
              </p>
              {products.length === 0 ? (
                <Button className="rounded-full mt-2" onClick={() => openPanel("publish")}>
                  Publicar artículo
                </Button>
              ) : (
                <Button variant="outline" className="rounded-full mt-2" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <ProductFeed
              products={sortedProducts}
              savedIds={savedIds}
              onToggleSave={toggleSaved}
              onProductClick={setSelectedProduct}
            />
          )}
        </div>
      </main>

      <HowItWorks />
      <Footer />

      {/* Mobile FAB */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden z-40"
        onClick={() => openPanel("publish")}
        aria-label="Publicar artículo"
      >
        <ArrowLeftRight className="h-6 w-6" />
      </Button>

      {/* Modals & Panels */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOwner={selectedProduct.userId === user?.id}
          onClose={() => setSelectedProduct(null)}
          onPropose={handlePropose}
          onDelete={handleDeleteProduct}
        />
      )}

      {activePanel === "publish" && <PublishModal onClose={closePanel} />}
      {activePanel === "notifications" && (
        <NotificationsPanel
          onClose={closePanel}
          onOpenChat={() => openPanel("chat")}
          proposals={incomingProposals}
          loading={notifLoading}
        />
      )}
      {activePanel === "chat" && <ChatPanel onClose={closePanel} />}
      {activePanel === "pricing" && <PricingModal onClose={closePanel} />}
      {activePanel === "settings" && (
        <SettingsPanel
          onClose={closePanel}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      )}
      {activePanel === "saved" && (
        <SavedItems
          products={savedProducts.map((p) => ({
            id: Number(p.id) || 0,
            image: p.imageUrl,
            title: p.title,
            description: p.description,
            wantsInReturn: p.wantsInReturn,
            acceptableItems: p.acceptableItems,
            condition: p.condition,
            category: p.category,
            timeAgo: "",
            user: { id: p.userId, name: p.userName || "", initials: p.userInitials || "", location: p.location, region: p.region, rating: 0, totalReviews: 0, totalSwaps: 0, memberSince: "", bio: "", verified: false, responseRate: 0, responseTime: "" },
          }))}
          onClose={closePanel}
          onProductClick={(product) => {
            closePanel();
            const fp = savedProducts.find((p) => p.userName === product.user.name && p.title === product.title);
            if (fp) setSelectedProduct(fp);
          }}
        />
      )}

      {activePanel === "discover" && products.length > 0 && (
        <DiscoverMode
          products={products}
          onClose={closePanel}
          onProductClick={(product) => {
            closePanel();
            setSelectedProduct(product);
          }}
          savedIds={savedIds}
          onToggleSave={toggleSaved}
        />
      )}
      {activePanel === "history" && (
        <TradeHistory
          onClose={closePanel}
        />
      )}
      {activePanel === "map" && (
        <MapExplorer
          products={products}
          onClose={closePanel}
          onProductClick={(product) => {
            closePanel();
            setSelectedProduct(product);
          }}
        />
      )}
      {activePanel === "events" && <TradeEvents onClose={closePanel} />}

      {proposalProduct && (
        <TruequeProposal product={proposalProduct} myProducts={myProducts} onClose={() => setProposalProduct(null)} />
      )}

      {boostProduct && (
        <BoostModal product={boostProduct} onClose={() => setBoostProduct(null)} />
      )}
    </div>
  );
};

export default Index;
