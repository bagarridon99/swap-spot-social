import { X, Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/mockProducts";

interface SavedItemsProps {
  products: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

const SavedItems = ({ products, onClose, onProductClick }: SavedItemsProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center gap-3 h-14">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-foreground" />
          </button>
          <Heart className="h-5 w-5 text-accent" />
          <span className="font-semibold text-foreground">Mis favoritos</span>
          <span className="text-sm text-muted-foreground">({products.length})</span>
        </div>
      </div>

      <div className="container max-w-4xl py-8">
        {products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">Aún no tienes favoritos</p>
            <p className="text-sm text-muted-foreground">
              Toca el ❤️ en cualquier publicación para guardarla aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
