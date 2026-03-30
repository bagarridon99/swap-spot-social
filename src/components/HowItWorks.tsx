import { Camera, Search, ArrowLeftRight, Handshake } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Publica",
    description: "Sube fotos de lo que ya no usas y describe qué te gustaría recibir a cambio.",
  },
  {
    icon: Search,
    title: "Explora",
    description: "Busca entre miles de artículos publicados por personas cerca de ti en Chile.",
  },
  {
    icon: ArrowLeftRight,
    title: "Propón",
    description: "Envía una propuesta de trueque. Conversa y acuerda los detalles por chat.",
  },
  {
    icon: Handshake,
    title: "Intercambia",
    description: "Coordinen un punto de encuentro seguro y completen el trueque. ¡Sin plata de por medio!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            ¿Cómo funciona?
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Intercambiar es fácil, rápido y 100% gratis. Solo necesitas algo que ofrecer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center space-y-3 p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="h-12 w-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
