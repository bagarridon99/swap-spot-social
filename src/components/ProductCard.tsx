import { MapPin, ArrowLeftRight, Heart, Crown, Zap } from "lucide-react";
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
  const { image, title, wantsInReturn, condition, user, timeAgo, views, boosted, premium } = product;

  return (
    <div
      className={`group bg-card rounded-xl overflow-hidden border card-hover cursor-pointer relative ${
        boosted ? "ring-2 ring-primary/30 shadow-md" : ""
      }`}
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
        <div className="absolute top-3 left-3 flex gap-1.5">
          {boosted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              <Zap className="h-3 w-3" />
              Destacado
            </span>
          ) : (
            <span className="swap-badge">
              <ArrowLeftRight className="h-3 w-3" />
              Trueque
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full font-medium">
            {condition}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.();
            }}
            className="h-7 w-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-accent text-accent" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground leading-tight line-clamp-1 flex-1">{title}</h3>
          {premium && <Crown className="h-4 w-4 text-amber-500 shrink-0" />}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1">Busca: {wantsInReturn}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-semibold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              {premium && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 border-2 border-card flex items-center justify-center">
                  <Crown className="h-1.5 w-1.5 text-white" />
                </span>
              )}
            </div>
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
