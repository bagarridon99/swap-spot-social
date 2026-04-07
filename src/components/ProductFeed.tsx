import { ArrowLeftRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SponsoredCard, { sponsoredAds } from "@/components/SponsoredCard";
import type { FirestoreProduct } from "@/lib/database";

interface ProductFeedProps {
  products: FirestoreProduct[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onProductClick: (product: FirestoreProduct) => void;
}

const ProductFeed = ({
  products,
  savedIds,
  onToggleSave,
  onProductClick,
}: ProductFeedProps) => {
  const items: JSX.Element[] = [];
  let adIndex = 0;

  products.forEach((product, i) => {
    items.push(
      <div
        key={`product-${product.id}`}
        className="animate-fade-in"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        <div
          onClick={() => onProductClick(product)}
          className="bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge
                variant="secondary"
                className="rounded-full text-[10px] bg-card/80 backdrop-blur-sm gap-1"
              >
                <ArrowLeftRight className="h-3 w-3" /> Trueque
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full text-[10px] bg-card/80 backdrop-blur-sm"
              >
                {product.condition}
              </Badge>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(product.id!);
              }}
              aria-label={savedIds.has(product.id!) ? "Quitar de guardados" : "Guardar artículo"}
              className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
                savedIds.has(product.id!)
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill={savedIds.has(product.id!) ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-display font-semibold text-foreground line-clamp-1">
              {product.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <ArrowLeftRight className="h-3 w-3" />
              <span>Busca: {product.wantsInReturn}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[9px] bg-secondary font-semibold">
                    {product.userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {product.userName}
                </span>
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
        <div
          key={`ad-${ad.id}`}
          className="animate-fade-in"
          style={{ animationDelay: `${(i + 1) * 80}ms` }}
        >
          <SponsoredCard ad={ad} />
        </div>
      );
      adIndex++;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items}
    </div>
  );
};

export default ProductFeed;
