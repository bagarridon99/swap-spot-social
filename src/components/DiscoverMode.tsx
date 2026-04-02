import { useState, useRef } from "react";
import { X, Heart, RotateCcw, ArrowLeftRight, MapPin, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockProducts";
import type { Product } from "@/data/mockProducts";
import { toast } from "sonner";

interface DiscoverModeProps {
  onClose: () => void;
  onProductClick: (product: Product) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
}

const DiscoverMode = ({ onClose, onProductClick, savedIds, onToggleSave }: DiscoverModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const products = mockProducts;
  const current = products[currentIndex];

  const swipe = (dir: "left" | "right") => {
    setDirection(dir);
    if (dir === "right" && current) {
      onToggleSave(current.id);
      toast.success("¡Guardado!");
    } else if (dir === "left") {
      toast("Descartado", { duration: 1000 });
    }
    setTimeout(() => {
      setHistory((h) => [...h, currentIndex]);
      setCurrentIndex((i) => Math.min(i + 1, products.length - 1));
      setDirection(null);
      setOffsetX(0);
    }, 300);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentIndex(prev);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setOffsetX(clientX - startX);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (Math.abs(offsetX) > 100) {
      swipe(offsetX > 0 ? "right" : "left");
    } else {
      setOffsetX(0);
    }
  };

  if (!current || currentIndex >= products.length) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card rounded-2xl p-8 text-center space-y-4 max-w-sm mx-4">
          <ArrowLeftRight className="h-12 w-12 mx-auto text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">¡Has visto todo!</h2>
          <p className="text-sm text-muted-foreground">No hay más productos por descubrir. Vuelve más tarde.</p>
          <Button className="rounded-full" onClick={onClose}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const rotation = offsetX * 0.1;
  const opacity = Math.max(0.3, 1 - Math.abs(offsetX) / 400);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-14">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">Descubrir</span>
          </div>
          <span className="text-xs text-muted-foreground">{currentIndex + 1}/{products.length}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] p-4">
        {/* Card */}
        <div
          ref={cardRef}
          className="relative w-full max-w-sm bg-card rounded-2xl overflow-hidden shadow-2xl border cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: direction === "left"
              ? "translateX(-150%) rotate(-30deg)"
              : direction === "right"
              ? "translateX(150%) rotate(30deg)"
              : `translateX(${offsetX}px) rotate(${rotation}deg)`,
            opacity: direction ? 0 : opacity,
            transition: direction || !dragging ? "all 0.3s ease-out" : "none",
          }}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={() => { if (dragging) handleTouchEnd(); }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicators */}
          {offsetX > 50 && (
            <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-xl border-2 border-primary bg-primary/20 text-primary font-bold text-lg rotate-[-20deg]">
              ¡ME GUSTA!
            </div>
          )}
          {offsetX < -50 && (
            <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-xl border-2 border-destructive bg-destructive/20 text-destructive font-bold text-lg rotate-[20deg]">
              PASO
            </div>
          )}

          <div className="aspect-[3/4] relative">
            <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full text-xs bg-card/80 backdrop-blur-sm">
                  {current.condition}
                </Badge>
                <Badge variant="secondary" className="rounded-full text-xs bg-card/80 backdrop-blur-sm">
                  {current.category}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-white">{current.title}</h3>
              <p className="text-sm text-white/80 line-clamp-2">{current.description}</p>

              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white/70">{current.user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-white/70">{current.user.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-white/90">Busca: {current.wantsInReturn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-6 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => swipe("left")}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={undo}
            disabled={history.length === 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => onProductClick(current)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => swipe("right")}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">Desliza → para guardar, ← para descartar</p>
      </div>
    </div>
  );
};

export default DiscoverMode;
