import { ArrowLeftRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { FirestoreProduct } from "@/lib/database";

interface ProductDetailModalProps {
  product: FirestoreProduct;
  isOwner: boolean;
  onClose: () => void;
  onPropose: (product: FirestoreProduct) => void;
  onDelete?: (product: FirestoreProduct) => void;
}

const ProductDetailModal = ({
  product,
  isOwner,
  onClose,
  onPropose,
  onDelete,
}: ProductDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8" role="dialog" aria-modal="true" aria-label={`Detalle de ${product.title}`}>
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-2xl overflow-y-auto shadow-2xl animate-fade-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-card/90 backdrop-blur-md">
          <Badge variant="secondary" className="rounded-full">
            {product.category} · {product.condition}
          </Badge>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary"
            aria-label="Cerrar detalle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              {product.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="p-3 rounded-xl bg-secondary/50 border space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                Busca: {product.wantsInReturn}
              </div>
              {product.acceptableItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.acceptableItems.map((item, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="rounded-full text-xs"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                  {product.userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {product.userName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {product.location}
                </p>
              </div>
            </div>
            {!isOwner && (
              <Button
                className="w-full rounded-full gap-2"
                onClick={() => onPropose(product)}
              >
                <ArrowLeftRight className="h-4 w-4" />
                Proponer trueque
              </Button>
            )}
            {isOwner && onDelete && (
              <Button
                variant="outline"
                className="w-full rounded-full gap-2 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(product)}
              >
                Eliminar publicación
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
