import { useState } from "react";
import { X, ArrowLeftRight, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Product } from "@/data/mockProducts";
import { mockProducts } from "@/data/mockProducts";
import { toast } from "sonner";

interface TruequeProposalProps {
  product: Product;
  onClose: () => void;
}

const TruequeProposal = ({ product, onClose }: TruequeProposalProps) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mock "my items" - first 3 products as user's own
  const myItems = mockProducts.slice(0, 3);

  const handleSubmit = () => {
    if (!selectedItem) {
      toast.error("Selecciona un artículo para ofrecer");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      toast.success("¡Propuesta enviada! Te notificaremos cuando responda.");
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl p-8 max-w-sm text-center space-y-4 animate-fade-in">
          <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
          <h3 className="font-display text-xl font-bold text-foreground">¡Propuesta enviada!</h3>
          <p className="text-sm text-muted-foreground">
            {product.user.name} recibirá tu propuesta y podrá aceptarla o contraproponer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Proponer trueque</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh] p-6 space-y-6">
          {/* What they're offering */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quieres obtener</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border">
              <img src={product.image} alt={product.title} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{product.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">{product.user.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{product.user.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-px w-8 bg-border" />
              <ArrowRight className="h-4 w-4 text-primary" />
              <div className="h-px w-8 bg-border" />
            </div>
          </div>

          {/* Select your item */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ofreces a cambio</p>
            <div className="grid grid-cols-1 gap-2">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedItem === item.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.condition}</p>
                  </div>
                  {selectedItem === item.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mensaje (opcional)</p>
            <Textarea
              placeholder="¡Hola! Me interesa tu artículo, te ofrezco..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1 rounded-full gap-2" onClick={handleSubmit}>
            <ArrowLeftRight className="h-4 w-4" />
            Enviar propuesta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TruequeProposal;
