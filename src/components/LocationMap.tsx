import { MapPin } from "lucide-react";
import { comunaCoordinates } from "@/data/chileanLocations";

interface LocationMapProps {
  location: string;
  region: string;
}

const LocationMap = ({ location, region }: LocationMapProps) => {
  const coords = comunaCoordinates[location];
  
  // Generate a slightly randomized position for the "approximate zone" circle
  const offsetX = Math.sin(location.length * 1.5) * 15;
  const offsetY = Math.cos(location.length * 1.5) * 10;
  const centerX = 50 + offsetX;
  const centerY = 45 + offsetY;

  return (
    <div className="rounded-xl border overflow-hidden bg-secondary/30">
      <div className="relative h-40 bg-gradient-to-br from-primary/5 via-secondary/30 to-primary/10 overflow-hidden">
        {/* Grid pattern to simulate map */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* Simulated streets */}
        <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="55%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
          <line x1="20%" y1="0" x2="35%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
          <line x1="60%" y1="0" x2="75%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
          <line x1="0" y1="70%" x2="100%" y2="65%" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="40%" y1="0" x2="50%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
        </svg>

        {/* Approximate zone circle */}
        <div
          className="absolute w-24 h-24 rounded-full border-2 border-primary/40 bg-primary/10 animate-pulse"
          style={{
            left: `${centerX}%`,
            top: `${centerY}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute w-3 h-3 rounded-full bg-primary shadow-lg"
          style={{
            left: `${centerX}%`,
            top: `${centerY}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Label */}
        <div
          className="absolute px-2 py-1 rounded-md bg-card/90 backdrop-blur-sm shadow-sm text-xs font-medium text-foreground"
          style={{
            left: `${centerX}%`,
            top: `${centerY - 18}%`,
            transform: "translateX(-50%)",
          }}
        >
          Zona aproximada
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 bg-card/50">
        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-xs text-muted-foreground">
          <strong className="text-foreground">{location}</strong>, {region}
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground italic">Ubicación aproximada</span>
      </div>
    </div>
  );
};

export default LocationMap;
