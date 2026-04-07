import { useState, useEffect } from "react";
import { X, Star, ArrowLeftRight, Clock, CheckCircle, XCircle, Send, Loader2, ArrowUpRight, ArrowDownLeft, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useProposals } from "@/hooks/useProposals";
import { updateProposalStatus, submitReview, type Proposal } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pendiente", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  accepted: { label: "Aceptado", icon: CheckCircle, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  rejected: { label: "Rechazado", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-muted-foreground", bg: "bg-muted border-muted" },
};

interface TradeHistoryProps {
  onClose: () => void;
}

const StarRatingInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} onClick={() => onChange(star)} className="transition-transform hover:scale-110" aria-label={`${star} estrellas`}>
        <Star className={`h-6 w-6 ${star <= value ? "fill-amber-400 text-amber-400" : "text-border hover:text-amber-300"}`} />
      </button>
    ))}
  </div>
);

const TradeHistory = ({ onClose }: TradeHistoryProps) => {
  const { user } = useAuth();
  const { proposals, loading } = useProposals(user?.id);

  const [filter, setFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<"all" | "sent" | "received">("all");
  const [ratingTrade, setRatingTrade] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [reviewedProposalIds, setReviewedProposalIds] = useState<Set<string>>(new Set());
  const [reviewLoading, setReviewLoading] = useState(false);

  // Load which proposals have already been reviewed by this user
  useEffect(() => {
    if (!user || proposals.length === 0) return;
    const accepted = proposals.filter((p) => p.status === "accepted").map((p) => p.id!);
    if (accepted.length === 0) return;

    supabase
      .from("reviews")
      .select("proposal_id")
      .eq("reviewer_id", user.id)
      .in("proposal_id", accepted)
      .then(({ data }) => {
        if (data) {
          setReviewedProposalIds(new Set(data.map((d: any) => d.proposal_id)));
        }
      });
  }, [user, proposals]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter by status
  const statusFiltered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

  // Filter by direction
  const dirFiltered = directionFilter === "all"
    ? statusFiltered
    : directionFilter === "sent"
    ? statusFiltered.filter((p) => p.fromUserId === user?.id)
    : statusFiltered.filter((p) => p.toUserId === user?.id);

  // Stats
  const stats = {
    total: proposals.length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    pending: proposals.filter((p) => p.status === "pending").length,
    sent: proposals.filter((p) => p.fromUserId === user?.id).length,
  };

  const handleCancel = async (proposal: Proposal) => {
    if (!window.confirm(`¿Cancelar tu propuesta de trueque?`)) return;
    setActionLoading(proposal.id!);
    try {
      await updateProposalStatus(proposal.id!, "cancelled");
      toast.success("Propuesta cancelada");
    } catch (err) {
      toast.error("Error al cancelar");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = async (proposal: Proposal) => {
    setActionLoading(proposal.id!);
    try {
      await updateProposalStatus(proposal.id!, "accepted");
      toast.success("¡Propuesta aceptada!");
    } catch (err) {
      toast.error("Error al aceptar");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposal: Proposal) => {
    setActionLoading(proposal.id!);
    try {
      await updateProposalStatus(proposal.id!, "rejected");
      toast.success("Propuesta rechazada");
    } catch (err) {
      toast.error("Error al rechazar");
    } finally {
      setActionLoading(null);
    }
  };

  const submitRating = async () => {
    if (ratingValue === 0 || !user || !ratingTrade) return;

    const proposal = proposals.find((p) => p.id === ratingTrade);
    if (!proposal) return;

    // Determine who to review: the other user in the trade
    const isSender = proposal.fromUserId === user.id;
    const reviewedId = isSender ? proposal.toUserId : proposal.fromUserId;

    setReviewLoading(true);
    try {
      await submitReview({
        reviewerId: user.id,
        reviewedId,
        proposalId: ratingTrade,
        rating: ratingValue,
        comment: ratingComment || undefined,
      });

      setReviewedProposalIds((prev) => new Set([...prev, ratingTrade]));
      toast.success(`¡Valoración de ${ratingValue} estrellas enviada!`);
    } catch (err: any) {
      if (err?.code === "23505") {
        toast.error("Ya dejaste una valoración para este trueque");
        setReviewedProposalIds((prev) => new Set([...prev, ratingTrade]));
      } else {
        console.error(err);
        toast.error("Error al enviar la valoración");
      }
    } finally {
      setReviewLoading(false);
      setRatingTrade(null);
      setRatingValue(0);
      setRatingComment("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-14">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors" aria-label="Cerrar historial">
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
            { label: "Aceptados", value: stats.accepted, icon: CheckCircle },
            { label: "Pendientes", value: stats.pending, icon: Clock },
            { label: "Enviadas", value: stats.sent, icon: Send },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-card border text-center">
              <s.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Direction filter */}
        <div className="flex gap-2">
          {[
            { key: "all" as const, label: "Todas", icon: ArrowLeftRight },
            { key: "sent" as const, label: "Enviadas", icon: ArrowUpRight },
            { key: "received" as const, label: "Recibidas", icon: ArrowDownLeft },
          ].map((d) => (
            <button
              key={d.key}
              onClick={() => setDirectionFilter(d.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                directionFilter === d.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <d.icon className="h-3 w-3" />
              {d.label}
            </button>
          ))}
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendientes" },
            { key: "accepted", label: "Aceptados" },
            { key: "rejected", label: "Rechazados" },
            { key: "cancelled", label: "Cancelados" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.key ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : dirFiltered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">No hay propuestas</p>
            <p className="text-sm text-muted-foreground">
              {proposals.length === 0
                ? "Cuando envíes o recibas propuestas de trueque, aparecerán aquí."
                : "Prueba con otro filtro."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dirFiltered.map((proposal) => {
              const isSender = proposal.fromUserId === user?.id;
              const otherName = isSender ? (proposal.toUserName || "Usuario") : (proposal.fromUserName || "Usuario");
              const otherInitials = otherName.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "US";
              const myProduct = isSender ? proposal.offeredProductTitle : proposal.requestedProductTitle;
              const myProductImg = isSender ? proposal.offeredProductImage : proposal.requestedProductImage;
              const theirProduct = isSender ? proposal.requestedProductTitle : proposal.offeredProductTitle;
              const theirProductImg = isSender ? proposal.requestedProductImage : proposal.offeredProductImage;
              const config = statusConfig[proposal.status || "pending"];
              const isCurrentAction = actionLoading === proposal.id;
              const dateStr = proposal.createdAt
                ? new Date(proposal.createdAt).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
                : "";

              return (
                <div key={proposal.id} className="p-4 rounded-xl bg-card border space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {otherInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-foreground">{otherName}</p>
                          {isSender ? (
                            <Badge variant="outline" className="text-[10px] rounded-full px-1.5 py-0 gap-0.5">
                              <ArrowUpRight className="h-2.5 w-2.5" /> Enviada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] rounded-full px-1.5 py-0 gap-0.5 border-primary/30 text-primary">
                              <ArrowDownLeft className="h-2.5 w-2.5" /> Recibida
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{dateStr}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-full text-xs ${config.bg} ${config.color}`}>
                      <config.icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Products exchange display */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="flex-1 flex items-center gap-2">
                      {myProductImg && (
                        <img src={myProductImg} alt={myProduct || ""} className="h-10 w-10 rounded-lg object-cover border shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">{isSender ? "Ofreciste" : "Tu artículo"}</p>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{myProduct}</p>
                      </div>
                    </div>
                    <ArrowLeftRight className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 flex items-center gap-2">
                      {theirProductImg && (
                        <img src={theirProductImg} alt={theirProduct || ""} className="h-10 w-10 rounded-lg object-cover border shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">{isSender ? "A cambio de" : "Ofrecen"}</p>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{theirProduct}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message if present */}
                  {proposal.message && (
                    <p className="text-xs text-muted-foreground italic px-1">"{proposal.message}"</p>
                  )}

                  {/* Actions for pending proposals */}
                  {proposal.status === "pending" && (
                    <div className="flex gap-2">
                      {isSender ? (
                        // Sender can cancel
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full flex-1 text-destructive hover:bg-destructive/10"
                          onClick={() => handleCancel(proposal)}
                          disabled={isCurrentAction}
                        >
                          {isCurrentAction ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancelar propuesta"}
                        </Button>
                      ) : (
                        // Receiver can accept or reject
                        <>
                          <Button
                            size="sm"
                            className="rounded-full flex-1 gap-1"
                            onClick={() => handleAccept(proposal)}
                            disabled={isCurrentAction}
                          >
                            {isCurrentAction ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle className="h-3 w-3" /> Aceptar</>}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full flex-1 text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(proposal)}
                            disabled={isCurrentAction}
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Rating CTA for accepted proposals */}
                  {proposal.status === "accepted" && (
                    <>
                      {reviewedProposalIds.has(proposal.id!) ? (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <CheckCheck className="h-4 w-4 text-primary" />
                          <span className="text-xs text-primary font-medium">Ya valoraste este trueque</span>
                        </div>
                      ) : ratingTrade === proposal.id ? (
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
                            <Button size="sm" className="rounded-full flex-1" onClick={submitRating} disabled={ratingValue === 0 || reviewLoading}>
                              {reviewLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Enviar valoración"}
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setRatingTrade(null)} disabled={reviewLoading}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full w-full gap-2"
                          onClick={() => setRatingTrade(proposal.id!)}
                        >
                          <Star className="h-3.5 w-3.5" />
                          Valorar trueque
                        </Button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
