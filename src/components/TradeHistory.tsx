import { X, Star, ArrowLeftRight, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

interface TradeRecord {
  id: string;
  myItem: string;
  theirItem: string;
  otherUser: string;
  otherUserInitials: string;
  status: "pending" | "accepted" | "completed" | "rejected";
  date: string;
  rating?: number;
}

const mockTrades: TradeRecord[] = [
  { id: "t1", myItem: "Zapatillas Nike Air", theirItem: "Bolso de cuero vintage", otherUser: "Catalina Muñoz", otherUserInitials: "CM", status: "completed", date: "15 Mar 2026", rating: 5 },
  { id: "t2", myItem: "Guitarra acústica", theirItem: "Teclado Yamaha", otherUser: "Valentina Rojas", otherUserInitials: "VR", status: "completed", date: "10 Mar 2026", rating: 4 },
  { id: "t3", myItem: "Cámara analógica", theirItem: "Lente 50mm", otherUser: "Sebastián Díaz", otherUserInitials: "SD", status: "accepted", date: "28 Mar 2026" },
  { id: "t4", myItem: "Colección de libros", theirItem: "Comics Marvel", otherUser: "Tomás Herrera", otherUserInitials: "TH", status: "pending", date: "1 Abr 2026" },
  { id: "t5", myItem: "Bicicleta de montaña", theirItem: "Patinete eléctrico", otherUser: "Matías Vergara", otherUserInitials: "MV", status: "rejected", date: "20 Feb 2026" },
];

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  accepted: { label: "Aceptado", icon: CheckCircle, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  completed: { label: "Completado", icon: CheckCircle, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  rejected: { label: "Rechazado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

interface TradeHistoryProps {
  onClose: () => void;
}

const StarRatingInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} onClick={() => onChange(star)} className="transition-transform hover:scale-110">
        <Star className={`h-6 w-6 ${star <= value ? "fill-amber-400 text-amber-400" : "text-border hover:text-amber-300"}`} />
      </button>
    ))}
  </div>
);

const TradeHistory = ({ onClose }: TradeHistoryProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [ratingTrade, setRatingTrade] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  const filtered = filter === "all" ? mockTrades : mockTrades.filter((t) => t.status === filter);

  const stats = {
    total: mockTrades.length,
    completed: mockTrades.filter((t) => t.status === "completed").length,
    pending: mockTrades.filter((t) => t.status === "pending").length,
    avgRating: mockTrades.filter((t) => t.rating).reduce((a, t) => a + (t.rating || 0), 0) / (mockTrades.filter((t) => t.rating).length || 1),
  };

  const submitRating = () => {
    toast.success(`¡Valoración de ${ratingValue} estrellas enviada!`);
    setRatingTrade(null);
    setRatingValue(0);
    setRatingComment("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-14">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-display font-bold text-foreground">Historial de Trueques</span>
          <div className="w-6" />
        </div>
      </div>

      <div className="container max-w-2xl py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, icon: ArrowLeftRight },
            { label: "Completados", value: stats.completed, icon: CheckCircle },
            { label: "Pendientes", value: stats.pending, icon: Clock },
            { label: "Valoración", value: stats.avgRating.toFixed(1), icon: Star },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-card border text-center">
              <s.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendientes" },
            { key: "accepted", label: "Aceptados" },
            { key: "completed", label: "Completados" },
            { key: "rejected", label: "Rechazados" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Trade list */}
        <div className="space-y-3">
          {filtered.map((trade) => {
            const config = statusConfig[trade.status];
            return (
              <div key={trade.id} className="p-4 rounded-xl bg-card border space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {trade.otherUserInitials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{trade.otherUser}</p>
                      <p className="text-xs text-muted-foreground">{trade.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`rounded-full text-xs ${config.bg} ${config.color}`}>
                    <config.icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground">Tu ofreciste</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{trade.myItem}</p>
                  </div>
                  <ArrowLeftRight className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground">A cambio de</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{trade.theirItem}</p>
                  </div>
                </div>

                {/* Rating display or CTA */}
                {trade.status === "completed" && (
                  <>
                    {trade.rating ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Tu valoración:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-3.5 w-3.5 ${s <= trade.rating! ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                          ))}
                        </div>
                      </div>
                    ) : ratingTrade === trade.id ? (
                      <div className="space-y-3 p-3 rounded-lg bg-secondary/30 border">
                        <p className="text-sm font-medium text-foreground">¿Cómo fue tu experiencia?</p>
                        <StarRatingInput value={ratingValue} onChange={setRatingValue} />
                        <textarea
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          placeholder="Deja un comentario (opcional)"
                          className="w-full rounded-lg bg-card border p-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="rounded-full flex-1" onClick={submitRating} disabled={ratingValue === 0}>
                            Enviar valoración
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full" onClick={() => setRatingTrade(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-full gap-2"
                        onClick={() => setRatingTrade(trade.id)}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Valorar trueque
                      </Button>
                    )}
                  </>
                )}

                {trade.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full flex-1 text-destructive hover:bg-destructive/10">
                      Cancelar
                    </Button>
                    <Button size="sm" className="rounded-full flex-1 gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Recordar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
