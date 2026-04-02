import {
  ArrowLeftRight,
  Star,
  MapPin,
  Clock,
  Shield,
  MessageCircle,
  Heart,
  Share2,
  ChevronRight,
  BadgeCheck,
  X,
  Zap,
  Eye,
  Flag,
  TrendingUp,
  Crown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/mockProducts";
import LocationMap from "@/components/LocationMap";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onViewProfile: (userId: string) => void;
  onPropose: () => void;
  onBoost: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : star <= rating
            ? "fill-amber-400/50 text-amber-400"
            : "text-border"
        }`}
      />
    ))}
  </div>
);

const ProductDetail = ({ product, onClose, onViewProfile, onPropose, onBoost, saved, onToggleSave }: ProductDetailProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[92vh] bg-card rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>

        <div className="overflow-y-auto max-h-[92vh]">
          <div className="grid sm:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-square sm:aspect-auto sm:h-full">
              <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {product.boosted ? (
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
                <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                  {product.condition}
                </span>
                {product.premium && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white">
                    <Crown className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{product.category} · {product.timeAgo}</p>
                  {product.views && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {product.views}
                    </div>
                  )}
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mt-1">{product.title}</h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

              {/* What they want */}
              <div className="space-y-3 p-4 rounded-xl bg-secondary/50 border">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Acepta a cambio</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.acceptableItems.map((item) => (
                    <Badge key={item} variant="secondary" className="rounded-full font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Seller card */}
              <div
                className="p-4 rounded-xl border bg-card cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => onViewProfile(product.user.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {product.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      {product.premium && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 border-2 border-card flex items-center justify-center">
                          <Crown className="h-2 w-2 text-white" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground text-sm">{product.user.name}</span>
                        {product.user.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={product.user.rating} />
                        <span className="text-xs text-muted-foreground">
                          {product.user.rating} ({product.user.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{product.user.totalSwaps}</p>
                    <p className="text-[11px] text-muted-foreground">Trueques</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{product.user.responseRate}%</p>
                    <p className="text-[11px] text-muted-foreground">Respuesta</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{product.user.responseTime}</p>
                    <p className="text-[11px] text-muted-foreground">Tiempo resp.</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.user.location}, {product.user.region}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Miembro desde {product.user.memberSince}
                </div>
                {product.user.verified && (
                  <div className="flex items-center gap-1.5 text-primary">
                    <Shield className="h-3.5 w-3.5" />
                    Verificado
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 gap-2 rounded-full" onClick={onPropose}>
                  <Zap className="h-4 w-4" />
                  Proponer trueque
                </Button>
                <Button variant="outline" size="icon" className="rounded-full shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={(e) => { e.stopPropagation(); onToggleSave?.(); }}
                >
                  <Heart className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full shrink-0" onClick={() => toast.success("Link copiado al portapapeles")}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Boost CTA */}
              <div
                onClick={onBoost}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-primary/10 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">¿Es tu publicación? Destácala</p>
                  <p className="text-xs text-muted-foreground">Obtén hasta 8x más visitas desde $990</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Report */}
              <button
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => toast.info("Gracias por reportar. Revisaremos esta publicación.")}
              >
                <Flag className="h-3 w-3" />
                Reportar publicación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
