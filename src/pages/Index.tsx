import { useState } from "react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import UserProfileView from "@/components/UserProfileView";
import { mockProducts, mockUsers } from "@/data/mockProducts";
import type { Product, UserProfile } from "@/data/mockProducts";
import { ArrowLeftRight, TrendingUp, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleViewProfile = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedProduct(null);
      setSelectedUser(user);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

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
            Encuentra personas que tienen lo que necesitas y ofrece lo que ya no usas.
          </p>

          <div className="flex justify-center md:hidden">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="¿Qué buscas intercambiar?"
                className="w-full rounded-full bg-card pl-10 pr-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-primary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">2.4k</strong> usuarios</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">850</strong> trueques</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container py-8 space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Categorías</h2>
          <CategoryFilter />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Publicaciones recientes</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              Ver todo
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden z-40"
      >
        <ArrowLeftRight className="h-6 w-6" />
      </Button>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onViewProfile={handleViewProfile}
        />
      )}

      {/* User Profile View */}
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
    </div>
  );
};

export default Index;
