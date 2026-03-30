import { useState } from "react";
import {
  Laptop,
  Shirt,
  BookOpen,
  Bike,
  Music,
  Camera,
  Sofa,
  Gamepad2,
  Sparkles,
} from "lucide-react";

const categories = [
  { icon: Sparkles, label: "Todo" },
  { icon: Laptop, label: "Tecnología" },
  { icon: Shirt, label: "Ropa" },
  { icon: BookOpen, label: "Libros" },
  { icon: Bike, label: "Deportes" },
  { icon: Music, label: "Música" },
  { icon: Camera, label: "Fotografía" },
  { icon: Sofa, label: "Hogar" },
  { icon: Gamepad2, label: "Gaming" },
];

const CategoryFilter = () => {
  const [active, setActive] = useState("Todo");

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(({ icon: Icon, label }) => (
        <button
          key={label}
          onClick={() => setActive(label)}
          className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium transition-all whitespace-nowrap min-w-[72px] ${
            active === label
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
