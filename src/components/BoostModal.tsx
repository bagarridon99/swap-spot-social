import { useState } from "react";
import { X, Zap, Star, Eye, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/mockProducts";
import { toast } from "sonner";

interface BoostModalProps {
  product: Product;
  onClose: () => void;
}

const boostOptions = [
  {
    id: "24h",
    icon: Eye,
    label: "Destacar 24 horas",
    price: "$990",
    priceNum: 990,
    description: "Tu publicación aparece al inicio del feed por 24 horas",
    stats: "~3x más visitas",
    popular: false,
  },
  {
    id: "48h",
    icon: Star,
    label: "Destacar 48 horas",
    price: "$1.690",
    priceNum: 1690,
    description: "48 horas de exposición máxima + badge destacado",
    stats: "~5x más visitas",
    popular: true,
  },
  {
    id: "72h",
    icon: Zap,
    label: "Destacar 72 horas",
    price: "$2.290",
    priceNum: 2290,
    description: "3 días completos al tope del feed + notificación a usuarios cercanos",
    stats: "~8x más visitas",
    popular: false,
  },
];

const BoostModal = ({ product, onClose }: BoostModalProps) => {
  const [selected, setSelected] = useState("48h");
  const [submitted, setSubmitted] = useState(false);

  const handleBoost = () => {
    setSubmitted(true);
    setTimeout(() => {
      toast.success("¡Publicación destacada! Ahora aparecerá al inicio del feed 🚀");
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl p-8 max-w-sm text-center space-y-4 animate-fade-in">
          <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
          <h3 className="font-display text-xl font-bold text-foreground">¡Publicación destacada!</h3>
          <p className="text-sm text-muted-foreground">
            "{product.title}" ahora aparecerá al inicio del feed con un badge especial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Destacar publicación</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border">
            <img src={product.image} alt={product.title} className="h-14 w-14 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-semibold text-foreground">{product.title}</p>
              <p className="text-xs text-muted-foreground">{product.views || 0} visitas actuales</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {boostOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                    selected === opt.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{opt.price}</p>
                      <p className="text-[10px] text-primary font-medium">{opt.stats}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Tu publicación aparecerá con un badge <strong className="text-foreground">⚡ Destacado</strong> y se mostrará primero en los resultados de búsqueda.
            </p>
          </div>
        </div>

        <div className="p-4 border-t flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1 rounded-full gap-2" onClick={handleBoost}>
            <Zap className="h-4 w-4" />
            Destacar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoostModal;
