import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { chileanRegions } from "@/data/mockProducts";

interface RegionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const RegionFilter = ({ value, onChange }: RegionFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
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
    </div>
  );
};

export default RegionFilter;
