import {
  Star,
  MapPin,
  BadgeCheck,
  ArrowLeft,
  Calendar,
  Shield,
  Zap,
  MessageCircle,
  Award,
  Trophy,
  Flame,
  Crown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import type { UserProfile, Product } from "@/data/mockProducts";
import { mockProducts } from "@/data/mockProducts";

interface UserProfileViewProps {
  user: UserProfile;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-border"
        }`}
      />
    ))}
  </div>
);

const mockReviews = [
  { author: "Lucía P.", rating: 5, text: "Excelente trato, todo como lo describió. ¡Muy recomendable!", date: "Hace 2 semanas" },
  { author: "Javier M.", rating: 4, text: "Buen intercambio, puntual y amable.", date: "Hace 1 mes" },
  { author: "Sofía R.", rating: 5, text: "Super rápido y el producto en perfecto estado.", date: "Hace 2 meses" },
];

const UserProfileView = ({ user, onBack, onProductClick }: UserProfileViewProps) => {
  const userProducts = mockProducts.filter((p) => p.user.id === user.id);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center gap-3 h-14">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-semibold text-foreground">Perfil de usuario</span>
        </div>
      </div>

      <div className="container max-w-2xl py-8 space-y-8">
        {/* Profile header */}
        <div className="text-center space-y-4">
          <Avatar className="h-20 w-20 mx-auto ring-4 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {user.initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
              {user.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {user.location}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <StarRating rating={user.rating} />
            <span className="text-sm font-medium text-foreground">{user.rating}</span>
            <span className="text-sm text-muted-foreground">({user.totalReviews} reseñas)</span>
          </div>

          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{user.bio}</p>

          <div className="flex justify-center gap-3">
            <Button className="gap-2 rounded-full">
              <Zap className="h-4 w-4" />
              Proponer trueque
            </Button>
            <Button variant="outline" className="gap-2 rounded-full">
              <MessageCircle className="h-4 w-4" />
              Mensaje
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-card border">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.totalSwaps}</p>
            <p className="text-xs text-muted-foreground">Trueques</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.totalReviews}</p>
            <p className="text-xs text-muted-foreground">Reseñas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.responseRate}%</p>
            <p className="text-xs text-muted-foreground">Respuesta</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.responseTime}</p>
            <p className="text-xs text-muted-foreground">Tiempo</p>
          </div>
        </div>

        {/* Badges & Reputation */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Insignias</h2>
          <div className="flex flex-wrap gap-2">
            {user.verified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Shield className="h-3.5 w-3.5" />
                Verificado
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Miembro desde {user.memberSince}
            </div>
            {user.totalSwaps >= 20 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                <Trophy className="h-3.5 w-3.5" />
                Super Truequero
              </div>
            )}
            {user.totalSwaps >= 10 && (
              <div className="swap-badge text-xs">
                <Zap className="h-3.5 w-3.5" />
                Truequeador experto
              </div>
            )}
            {user.rating >= 4.8 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Star className="h-3.5 w-3.5" />
                Top valorado
              </div>
            )}
            {user.responseRate >= 95 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                <Flame className="h-3.5 w-3.5" />
                Respuesta rápida
              </div>
            )}
            {user.totalSwaps >= 30 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 text-amber-600 text-xs font-medium">
                <Crown className="h-3.5 w-3.5" />
                Top del mes
              </div>
            )}
          </div>

          {/* Progress to next badge */}
          {user.totalSwaps < 20 && (
            <div className="p-3 rounded-xl bg-secondary/50 border">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Próxima insignia: <strong className="text-foreground">Super Truequero</strong></span>
                <span className="text-primary font-medium">{user.totalSwaps}/20 trueques</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(user.totalSwaps / 20) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Reseñas recientes</h2>
          <div className="space-y-3">
            {mockReviews.map((review, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{review.author}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User listings */}
        {userProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Publicaciones de {user.name.split(" ")[0]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
