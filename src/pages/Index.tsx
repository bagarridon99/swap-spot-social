import { useState, useMemo, useEffect } from "react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import CategoryFilter from "@/components/CategoryFilter";
import ProductDetail from "@/components/ProductDetail";
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
import SponsoredCard, { sponsoredAds } from "@/components/SponsoredCard";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeProducts, type FirestoreProduct } from "@/lib/firestore";
import { ArrowLeftRight, TrendingUp, Users, Search, Shield, MapPin, Crown, Compass, History, Map, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Panel = "notifications" | "chat" | "publish" | "saved" | "pricing" | "settings" | "discover" | "history" | "map" | "events" | null;

const Index = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [proposalProduct, setProposalProduct] = useState<FirestoreProduct | null>(null);
  const [boostProduct, setBoostProduct] = useState<FirestoreProduct | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [regionFilter, setRegionFilter] = useState("all");
  const [comunaFilter, setComunaFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [mobileSearch, setMobileSearch] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  // Subscribe to Firestore products in real-time
  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return unsub;
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("truequeya-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const myProducts = useMemo(() => {
    return products.filter((p) => p.userId === user?.uid);
  }, [products, user]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== "Todo" && p.category !== activeCategory) return false;
      if (regionFilter !== "all" && p.region !== regionFilter) return false;
      if (comunaFilter !== "all" && p.location !== comunaFilter) return false;
      const q = (searchQuery || mobileSearch).toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.wantsInReturn.toLowerCase().includes(q)) return false;
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

  const savedProducts = products.filter((p) => savedIds.has(p.id!));

  const handlePropose = (product: FirestoreProduct) => {
    setSelectedProduct(null);
    setProposalProduct(product);
  };

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
          {/* Inline product card for Firestore products */}
          <div
            onClick={() => setSelectedProduct(product)}
            className="bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge variant="secondary" className="rounded-full text-[10px] bg-card/80 backdrop-blur-sm gap-1">
                  <ArrowLeftRight className="h-3 w-3" /> Trueque
                </Badge>
                <Badge variant="secondary" className="rounded-full text-[10px] bg-card/80 backdrop-blur-sm">
                  {product.condition}
                </Badge>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSaved(product.id!); }}
                className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
                  savedIds.has(product.id!) ? "bg-primary text-primary-foreground" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={savedIds.has(product.id!) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-display font-semibold text-foreground line-clamp-1">{product.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <ArrowLeftRight className="h-3 w-3" />
                <span>Busca: {product.wantsInReturn}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[9px] bg-secondary font-semibold">{product.userInitials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{product.userName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {product.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

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
        onSettings={() => setActivePanel("settings")}
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
              <span><strong className="text-foreground">{products.length}</strong> publicaciones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">{new Set(products.map(p => p.region)).size}</strong> regiones</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">100%</strong> gratis</span>
            </div>
          </div>

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
              onClick={() => setActivePanel(item.panel)}
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

          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {products.length === 0 ? "Aún no hay publicaciones" : "No se encontraron artículos"}
              </p>
              <p className="text-sm text-muted-foreground">
                {products.length === 0 ? "¡Sé el primero en publicar!" : "Prueba con otra categoría o región"}
              </p>
              {products.length === 0 ? (
                <Button className="rounded-full mt-2" onClick={() => setActivePanel("publish")}>
                  Publicar artículo
                </Button>
              ) : (
                <Button variant="outline" className="rounded-full mt-2" onClick={() => { setActiveCategory("Todo"); setRegionFilter("all"); setComunaFilter("all"); setSearchQuery(""); setMobileSearch(""); }}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderFeedItems()}
            </div>
          )}
        </div>
      </main>

      <HowItWorks />
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
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-2xl overflow-y-auto shadow-2xl animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-card/90 backdrop-blur-md">
              <Badge variant="secondary" className="rounded-full">{selectedProduct.category} · {selectedProduct.condition}</Badge>
              <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-full hover:bg-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-square">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <h2 className="font-display text-xl font-bold text-foreground">{selectedProduct.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <div className="p-3 rounded-xl bg-secondary/50 border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ArrowLeftRight className="h-4 w-4 text-primary" />
                    Busca: {selectedProduct.wantsInReturn}
                  </div>
                  {selectedProduct.acceptableItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.acceptableItems.map((item, i) => (
                        <Badge key={i} variant="outline" className="rounded-full text-xs">{item}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">{selectedProduct.userInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedProduct.userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{selectedProduct.location}</p>
                  </div>
                </div>
                {selectedProduct.userId !== user?.uid && (
                  <Button className="w-full rounded-full gap-2" onClick={() => handlePropose(selectedProduct)}>
                    <ArrowLeftRight className="h-4 w-4" />
                    Proponer trueque
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel === "publish" && <PublishModal onClose={() => setActivePanel(null)} />}
      {activePanel === "notifications" && <NotificationsPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "chat" && <ChatPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "pricing" && <PricingModal onClose={() => setActivePanel(null)} />}
      {activePanel === "settings" && (
        <SettingsPanel
          onClose={() => setActivePanel(null)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      )}
      {activePanel === "saved" && (
        <SavedItems
          products={savedProducts.map(p => ({
            id: Number(p.id) || 0,
            image: p.imageUrl,
            title: p.title,
            description: p.description,
            wantsInReturn: p.wantsInReturn,
            acceptableItems: p.acceptableItems,
            condition: p.condition,
            category: p.category,
            timeAgo: "",
            user: { id: p.userId, name: p.userName, initials: p.userInitials, location: p.location, region: p.region, rating: 0, totalReviews: 0, totalSwaps: 0, memberSince: "", bio: "", verified: false, responseRate: 0, responseTime: "" },
          }))}
          onClose={() => setActivePanel(null)}
          onProductClick={() => {}}
        />
      )}

      {activePanel === "discover" && products.length > 0 && (
        <DiscoverMode
          onClose={() => setActivePanel(null)}
          onProductClick={(product) => {
            setActivePanel(null);
            // Find matching Firestore product
            const fp = products.find(p => p.title === product.title);
            if (fp) setSelectedProduct(fp);
          }}
          savedIds={new Set(Array.from(savedIds).map(Number).filter(n => !isNaN(n)))}
          onToggleSave={() => {}}
        />
      )}
      {activePanel === "history" && <TradeHistory onClose={() => setActivePanel(null)} />}
      {activePanel === "map" && (
        <MapExplorer
          onClose={() => setActivePanel(null)}
          onProductClick={(product) => {
            setActivePanel(null);
            const fp = products.find(p => p.title === product.title);
            if (fp) setSelectedProduct(fp);
          }}
        />
      )}
      {activePanel === "events" && <TradeEvents onClose={() => setActivePanel(null)} />}

      {proposalProduct && (
        <TruequeProposal product={proposalProduct} myProducts={myProducts} onClose={() => setProposalProduct(null)} />
      )}
    </div>
  );
};

export default Index;
