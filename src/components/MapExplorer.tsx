import { X, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockProducts";
import type { Product } from "@/data/mockProducts";
import { comunaCoordinates } from "@/data/chileanLocations";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface MapExplorerProps {
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

// Fix leaflet default marker icon issue
const FixMapCenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapExplorer = ({ onClose, onProductClick }: MapExplorerProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const categories = ["Todo", "Ropa", "Fotografía", "Deportes", "Música", "Libros"];

  const filtered = selectedCategory === "Todo"
    ? mockProducts
    : mockProducts.filter((p) => p.category === selectedCategory);

  // Group products by location
  const locationGroups = filtered.reduce((acc, product) => {
    const key = product.user.location;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const defaultCenter: [number, number] = [-33.4489, -70.6693]; // Santiago

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="sticky top-0 z-[1000] bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-14">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground">Explorar mapa</span>
          </div>
          <div className="w-6" />
        </div>
      </div>

      {/* Category filter */}
      <div className="absolute top-16 left-0 right-0 z-[1000] px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-lg mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-56px)] relative">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {Object.entries(locationGroups).map(([location, products]) => {
            const coords = comunaCoordinates[location];
            if (!coords) return null;

            // Add randomized offset for "approximate" location
            const jitterLat = (Math.sin(location.length * 2.7) * 0.005);
            const jitterLng = (Math.cos(location.length * 3.1) * 0.005);

            return (
              <Circle
                key={location}
                center={[coords.lat + jitterLat, coords.lng + jitterLng]}
                radius={800}
                pathOptions={{
                  color: "hsl(160, 45%, 40%)",
                  fillColor: "hsl(160, 45%, 40%)",
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <p className="font-semibold text-sm">{location}</p>
                    <p className="text-xs text-gray-500">{products.length} artículo{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}</p>
                    <div className="space-y-1.5">
                      {products.slice(0, 3).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => onProductClick(product)}
                          className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                          <img src={product.image} alt={product.title} className="h-8 w-8 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{product.title}</p>
                            <p className="text-[10px] text-gray-400">{product.category}</p>
                          </div>
                        </button>
                      ))}
                      {products.length > 3 && (
                        <p className="text-[10px] text-gray-400 text-center">+{products.length - 3} más</p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>

        {/* Bottom info card */}
        <div className="absolute bottom-6 left-4 right-4 z-[1000]">
          <div className="bg-card/95 backdrop-blur-md rounded-2xl border shadow-lg p-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{filtered.length} artículos en el mapa</p>
                <p className="text-xs text-muted-foreground">Los círculos muestran zonas aproximadas</p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                <MapPin className="h-3 w-3 mr-1" />
                {Object.keys(locationGroups).length} zonas
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
