import { MapPin, ArrowLeftRight, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Product } from "@/data/mockProducts";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}

const ProductCard = ({ product, onClick, saved, onToggleSave }: ProductCardProps) => {
  if (!product) return null;
  const { image, title, wantsInReturn, condition, user, timeAgo, views } = product;

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden border card-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={640}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 swap-badge">
          <ArrowLeftRight className="h-3 w-3" />
          Trueque
        </span>
        <span className="absolute top-3 right-12 bg-card/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full font-medium">
          {condition}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.();
          }}
          className="absolute top-3 right-3 h-7 w-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart className={`h-3.5 w-3.5 ${saved ? "fill-accent text-accent" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground leading-tight line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1">Busca: {wantsInReturn}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{user.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {user.location}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">{timeAgo}</p>
          {views && <p className="text-[11px] text-muted-foreground">{views} visitas</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
