import { useState } from "react";
import { X, Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TradeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  comuna: string;
  region: string;
  attendees: number;
  maxAttendees: number;
  categories: string[];
  organizer: string;
  image?: string;
}

const mockEvents: TradeEvent[] = [
  {
    id: "e1",
    title: "Gran Feria del Trueque - Parque Forestal",
    description: "La feria de trueque más grande de Santiago. Trae tus cosas y encuentra tesoros nuevos. Música en vivo y comida.",
    date: "12 Abril 2026",
    time: "10:00 - 18:00",
    location: "Parque Forestal, frente al MAC",
    comuna: "Santiago Centro",
    region: "Región Metropolitana",
    attendees: 234,
    maxAttendees: 300,
    categories: ["Ropa", "Libros", "Música", "Electrónica"],
    organizer: "TruequeYa Oficial",
  },
  {
    id: "e2",
    title: "Trueque Vintage - Barrio Italia",
    description: "Evento exclusivo de ropa vintage y artículos retro. Solo piezas de calidad. Café gratis para los asistentes.",
    date: "19 Abril 2026",
    time: "11:00 - 16:00",
    location: "Av. Italia 1400",
    comuna: "Providencia",
    region: "Región Metropolitana",
    attendees: 89,
    maxAttendees: 120,
    categories: ["Ropa", "Accesorios"],
    organizer: "Vintage Chile",
  },
  {
    id: "e3",
    title: "Feria de Libros x Libros",
    description: "¿Tienes libros que ya leíste? Tráelos y llévate otros. Especial novelas, comics y manga.",
    date: "26 Abril 2026",
    time: "14:00 - 19:00",
    location: "Biblioteca de Santiago",
    comuna: "Santiago Centro",
    region: "Región Metropolitana",
    attendees: 156,
    maxAttendees: 200,
    categories: ["Libros"],
    organizer: "Club Lectores Chile",
  },
  {
    id: "e4",
    title: "Trueque Deportivo - Viña del Mar",
    description: "Intercambia equipos deportivos, bicicletas, tablas de surf y más. En la playa de Reñaca.",
    date: "3 Mayo 2026",
    time: "09:00 - 15:00",
    location: "Playa de Reñaca",
    comuna: "Viña del Mar",
    region: "Valparaíso",
    attendees: 67,
    maxAttendees: 150,
    categories: ["Deportes"],
    organizer: "Deportes al Aire Libre",
  },
  {
    id: "e5",
    title: "Feria Musical del Sur",
    description: "Instrumentos, vinilos, CDs y todo lo musical. Bandas locales tocarán durante el evento.",
    date: "10 Mayo 2026",
    time: "12:00 - 20:00",
    location: "Plaza de Armas de Concepción",
    comuna: "Concepción",
    region: "Biobío",
    attendees: 45,
    maxAttendees: 100,
    categories: ["Música"],
    organizer: "Música del Biobío",
  },
];

interface TradeEventsProps {
  onClose: () => void;
}

const TradeEvents = ({ onClose }: TradeEventsProps) => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const regions = ["all", ...new Set(mockEvents.map((e) => e.region))];

  const filtered = selectedRegion === "all" ? mockEvents : mockEvents.filter((e) => e.region === selectedRegion);

  const handleRegister = (event: TradeEvent) => {
    toast.success(`¡Te has inscrito a "${event.title}"!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-14">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">Eventos de Trueque</span>
          </div>
          <div className="w-6" />
        </div>
      </div>

      <div className="container max-w-2xl py-6 space-y-6">
        {/* Region filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRegion === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {r === "all" ? "Todas las regiones" : r}
            </button>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-4">
          {filtered.map((event) => {
            const spotsLeft = event.maxAttendees - event.attendees;
            const fillPercent = (event.attendees / event.maxAttendees) * 100;

            return (
              <div key={event.id} className="rounded-2xl bg-card border overflow-hidden">
                {/* Event header gradient */}
                <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-accent" />
                
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-bold text-foreground">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">Organiza: {event.organizer}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full shrink-0">
                      {event.region}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{event.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-xs">{event.date}</p>
                        <p className="text-[10px]">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-xs">{event.comuna}</p>
                        <p className="text-[10px]">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex gap-1.5 flex-wrap">
                    {event.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="rounded-full text-[10px]">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  {/* Attendance bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {event.attendees} inscritos
                      </div>
                      <span className={`font-medium ${spotsLeft < 20 ? "text-destructive" : "text-primary"}`}>
                        {spotsLeft} cupos disponibles
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  <Button className="w-full rounded-full gap-2" onClick={() => handleRegister(event)}>
                    <Calendar className="h-4 w-4" />
                    Inscribirme al evento
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default TradeEvents;
