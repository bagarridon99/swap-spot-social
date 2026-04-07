import { useState, useRef } from "react";
import { X, Upload, ArrowLeftRight, MapPin, Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/components/CategoryFilter";
import { chileanRegions } from "@/data/mockProducts";
import { comunasByRegion } from "@/data/chileanLocations";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/i18n";
import { addProduct, uploadMultipleProductImages } from "@/lib/database";

interface PublishModalProps {
  onClose: () => void;
}

const MAX_IMAGES = 5;
const conditions = ["Nuevo", "Como nuevo", "Buen estado", "Usado", "Para reparar"];

const PublishModal = ({ onClose }: PublishModalProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [wantsInReturn, setWantsInReturn] = useState("");
  const [acceptableItem, setAcceptableItem] = useState("");
  const [acceptableItems, setAcceptableItems] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalAllowed = MAX_IMAGES - imageFiles.length;
    const toAdd = files.slice(0, totalAllowed);

    if (files.length > totalAllowed) {
      toast.info(`Máximo ${MAX_IMAGES} imágenes. Se seleccionaron las primeras ${totalAllowed}.`);
    }

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setImageFiles((prev) => [...prev, ...toAdd]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset input so the same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addAcceptableItem = () => {
    if (acceptableItem.trim() && acceptableItems.length < 6) {
      setAcceptableItems([...acceptableItems, acceptableItem.trim()]);
      setAcceptableItem("");
    }
  };

  const removeAcceptableItem = (index: number) => {
    setAcceptableItems(acceptableItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !condition || !region || !wantsInReturn) {
      toast.error(t("publish.fillRequired"));
      return;
    }
    if (!comuna) {
      toast.error(t("publish.selectComuna2"));
      return;
    }
    if (imageFiles.length === 0) {
      toast.error(t("publish.uploadImage"));
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const imageUrls = await uploadMultipleProductImages(imageFiles, user.id);

      await addProduct({
        title,
        description,
        category,
        condition,
        wantsInReturn,
        acceptableItems,
        imageUrl: imageUrls[0],
        imageUrls,
        region,
        location: comuna,
        userId: user.id,
      });

      toast.success(t("publish.success"));
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(t("publish.error") + (err?.message || "Intenta de nuevo"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-display text-lg font-bold text-foreground">{t("publish.title")}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh] p-6 space-y-5">
          {/* Image upload area */}
          <input type="file" accept="image/*" multiple ref={fileRef} className="hidden" onChange={handleImageSelect} />

          {imagePreviews.length === 0 ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t("publish.uploadPhoto")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("publish.uploadHint")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-medium">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
                {imageFiles.length < MAX_IMAGES && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">{imageFiles.length}/{MAX_IMAGES}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">{t("publish.itemTitle")}</Label>
            <Input id="title" placeholder="Ej: Guitarra acústica Yamaha" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("publish.description")}</Label>
            <Textarea id="description" placeholder="Describe tu artículo: estado, marca, tamaño, historia..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("publish.category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder={t("publish.select")} /></SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.label !== "Todo").map(c => (
                    <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("publish.condition")}</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger><SelectValue placeholder={t("publish.select")} /></SelectTrigger>
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
              {t("publish.region")}
            </Label>
            <Select value={region} onValueChange={(val) => { setRegion(val); setComuna(""); }}>
              <SelectTrigger><SelectValue placeholder={t("publish.selectRegion")} /></SelectTrigger>
              <SelectContent>
                {chileanRegions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {region && comunasByRegion[region] && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {t("publish.comuna")}
              </Label>
              <Select value={comuna} onValueChange={setComuna}>
                <SelectTrigger><SelectValue placeholder={t("publish.selectComuna")} /></SelectTrigger>
                <SelectContent>
                  {comunasByRegion[region].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              {t("publish.wantsInReturn")}
            </Label>
            <Input placeholder="Ej: Mochila de trekking" value={wantsInReturn} onChange={(e) => setWantsInReturn(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t("publish.acceptableItems")}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("publish.addOptions")}
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
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>{t("publish.cancel")}</Button>
          <Button className="flex-1 rounded-full" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {t("publish.submitting")}</> : t("publish.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
