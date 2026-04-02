import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { chileanRegions } from "@/data/mockProducts";
import { comunasByRegion } from "@/data/chileanLocations";

interface RegionFilterProps {
  value: string;
  onChange: (value: string) => void;
  comunaValue: string;
  onComunaChange: (value: string) => void;
}

const RegionFilter = ({ value, onChange, comunaValue, onComunaChange }: RegionFilterProps) => {
  const comunas = value !== "all" ? comunasByRegion[value] || [] : [];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(v) => { onChange(v); onComunaChange("all"); }}>
        <SelectTrigger className="w-[200px] rounded-full border bg-card text-sm">
          <SelectValue placeholder="Todo Chile" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo Chile 🇨🇱</SelectItem>
          {chileanRegions.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {comunas.length > 0 && (
        <Select value={comunaValue} onValueChange={onComunaChange}>
          <SelectTrigger className="w-[180px] rounded-full border bg-card text-sm">
            <SelectValue placeholder="Todas las comunas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las comunas</SelectItem>
            {comunas.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default RegionFilter;
