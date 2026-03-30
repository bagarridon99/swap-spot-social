import { ExternalLink, Megaphone } from "lucide-react";

export interface SponsoredAd {
  id: string;
  image: string;
  title: string;
  description: string;
  sponsor: string;
  ctaText: string;
  ctaUrl: string;
  category?: string;
}

export const sponsoredAds: SponsoredAd[] = [
  {
    id: "ad1",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=640&h=400&fit=crop",
    title: "Equipa tu aventura este verano",
    description: "Hasta 40% de descuento en equipos de trekking y camping. Despacho a todo Chile.",
    sponsor: "Doite Outdoors",
    ctaText: "Ver ofertas",
    ctaUrl: "#",
    category: "Deportes",
  },
  {
    id: "ad2",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=640&h=400&fit=crop",
    title: "Renueva tu hogar con estilo",
    description: "Muebles y decoración con envío gratis a la RM. Diseño escandinavo a precios accesibles.",
    sponsor: "Casa Ideas",
    ctaText: "Explorar catálogo",
    ctaUrl: "#",
    category: "Hogar",
  },
  {
    id: "ad3",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&h=400&fit=crop",
    title: "Tecnología al mejor precio",
    description: "Audífonos, parlantes y accesorios tech con garantía. Retiro en tienda o despacho express.",
    sponsor: "PC Factory",
    ctaText: "Comprar ahora",
    ctaUrl: "#",
    category: "Tecnología",
  },
];

interface SponsoredCardProps {
  ad: SponsoredAd;
}

const SponsoredCard = ({ ad }: SponsoredCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={ad.image}
          alt={ad.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-[10px] font-medium text-muted-foreground">
          <Megaphone className="h-3 w-3" />
          Patrocinado
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">{ad.sponsor}</p>
          <h3 className="font-semibold text-foreground leading-tight">{ad.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
        <a
          href={ad.ctaUrl}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {ad.ctaText}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default SponsoredCard;
