import { useState } from "react";
import { X, Upload, ArrowLeftRight, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/components/CategoryFilter";
import { chileanRegions } from "@/data/mockProducts";
import { toast } from "sonner";

interface PublishModalProps {
  onClose: () => void;
}

const conditions = ["Nuevo", "Como nuevo", "Buen estado", "Usado", "Para reparar"];

const PublishModal = ({ onClose }: PublishModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [region, setRegion] = useState("");
  const [wantsInReturn, setWantsInReturn] = useState("");
  const [acceptableItem, setAcceptableItem] = useState("");
  const [acceptableItems, setAcceptableItems] = useState<string[]>([]);

  const addAcceptableItem = () => {
    if (acceptableItem.trim() && acceptableItems.length < 6) {
      setAcceptableItems([...acceptableItems, acceptableItem.trim()]);
      setAcceptableItem("");
    }
  };

  const removeAcceptableItem = (index: number) => {
    setAcceptableItems(acceptableItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !description || !category || !condition || !region || !wantsInReturn) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    toast.success("¡Publicación creada! Tu artículo ya está visible para otros usuarios.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display text-lg font-bold text-foreground">Publicar artículo</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh] p-6 space-y-5">
          {/* Image upload area */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Arrastra fotos aquí o haz clic para subir</p>
            <p className="text-xs text-muted-foreground mt-1">Máximo 5 fotos · JPG, PNG</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título del artículo *</Label>
            <Input id="title" placeholder="Ej: Guitarra acústica Yamaha" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea id="description" placeholder="Describe tu artículo: estado, marca, tamaño, historia..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.label !== "Todo").map(c => (
                    <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condición *</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {conditions.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Región *
            </Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue placeholder="Selecciona tu región" /></SelectTrigger>
              <SelectContent>
                {chileanRegions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              ¿Qué te gustaría recibir a cambio? *
            </Label>
            <Input placeholder="Ej: Mochila de trekking" value={wantsInReturn} onChange={(e) => setWantsInReturn(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Artículos aceptables (opcional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Agrega opciones..."
                value={acceptableItem}
                onChange={(e) => setAcceptableItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAcceptableItem())}
              />
              <Button type="button" size="icon" variant="outline" onClick={addAcceptableItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {acceptableItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {acceptableItems.map((item, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 rounded-full">
                    {item}
                    <button onClick={() => removeAcceptableItem(i)}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1 rounded-full" onClick={handleSubmit}>Publicar</Button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
