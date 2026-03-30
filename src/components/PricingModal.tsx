import { X, Check, Crown, Zap, Star, Eye, Camera, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PricingModalProps {
  onClose: () => void;
}

const plans = [
  {
    name: "Gratis",
    price: "$0",
    period: "para siempre",
    description: "Perfecto para empezar a intercambiar",
    cta: "Plan actual",
    disabled: true,
    popular: false,
    features: [
      { text: "Hasta 5 publicaciones activas", included: true },
      { text: "3 fotos por publicación", included: true },
      { text: "Chat con otros usuarios", included: true },
      { text: "Perfil básico", included: true },
      { text: "Publicaciones destacadas", included: false },
      { text: "Badge Premium", included: false },
      { text: "Estadísticas de visitas", included: false },
      { text: "Prioridad en búsquedas", included: false },
      { text: "Sin publicidad", included: false },
      { text: "Verificación prioritaria", included: false },
    ],
  },
  {
    name: "Premium",
    price: "$4.990",
    period: "/mes",
    description: "Más visibilidad y herramientas pro",
    cta: "Comenzar prueba gratis",
    disabled: false,
    popular: true,
    icon: Crown,
    features: [
      { text: "Publicaciones ilimitadas", included: true },
      { text: "10 fotos por publicación", included: true },
      { text: "Chat con otros usuarios", included: true },
      { text: "Perfil Premium con badge", included: true },
      { text: "3 destacados gratis al mes", included: true },
      { text: "Badge Premium dorado", included: true },
      { text: "Estadísticas detalladas", included: true },
      { text: "Prioridad en búsquedas", included: true },
      { text: "Sin publicidad", included: true },
      { text: "Verificación prioritaria", included: true },
    ],
  },
  {
    name: "Pro",
    price: "$9.990",
    period: "/mes",
    description: "Para emprendedores y tiendas",
    cta: "Comenzar prueba gratis",
    disabled: false,
    popular: false,
    icon: Zap,
    features: [
      { text: "Todo de Premium", included: true },
      { text: "Fotos ilimitadas", included: true },
      { text: "10 destacados gratis al mes", included: true },
      { text: "Perfil de tienda", included: true },
      { text: "Analíticas avanzadas", included: true },
      { text: "Soporte prioritario", included: true },
      { text: "API de integración", included: true },
      { text: "Multi-ubicación", included: true },
      { text: "Marca personalizada", included: true },
      { text: "Exportar datos", included: true },
    ],
  },
];

const PricingModal = ({ onClose }: PricingModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Planes y Precios</h2>
            <p className="text-sm text-muted-foreground mt-1">Elige el plan que mejor se adapte a ti. 7 días de prueba gratis.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[78vh] p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 space-y-5 transition-shadow ${
                    plan.popular
                      ? "border-primary shadow-lg ring-1 ring-primary"
                      : "hover:shadow-md"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Más popular
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <Button
                    className={`w-full rounded-full ${plan.popular ? "" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    disabled={plan.disabled}
                    onClick={() => {
                      toast.success(`¡Prueba gratis de ${plan.name} activada! Disfruta 7 días sin costo.`);
                      onClose();
                    }}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-2 text-sm">
                        <Check
                          className={`h-4 w-4 mt-0.5 shrink-0 ${
                            feature.included ? "text-primary" : "text-border"
                          }`}
                        />
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground line-through"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Extra features */}
          <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground text-center">
              También disponible: Boosts individuales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-card border space-y-2">
                <Eye className="h-6 w-6 mx-auto text-primary" />
                <p className="font-semibold text-foreground text-sm">Destacar 24h</p>
                <p className="text-2xl font-bold text-foreground">$990</p>
                <p className="text-xs text-muted-foreground">Tu publicación al inicio del feed</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border space-y-2 ring-1 ring-primary">
                <Star className="h-6 w-6 mx-auto text-primary" />
                <p className="font-semibold text-foreground text-sm">Destacar 48h</p>
                <p className="text-2xl font-bold text-foreground">$1.690</p>
                <p className="text-xs text-muted-foreground">Mejor relación calidad-precio</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border space-y-2">
                <Zap className="h-6 w-6 mx-auto text-primary" />
                <p className="font-semibold text-foreground text-sm">Destacar 72h</p>
                <p className="text-2xl font-bold text-foreground">$2.290</p>
                <p className="text-xs text-muted-foreground">Máxima exposición para tu artículo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
