import { useEffect, useState } from "react";
import { X, ArrowLeftRight, MessageCircle, Star, Package, CheckCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeProposals, type Proposal } from "@/lib/database";

interface NotificationsPanelProps {
  onClose: () => void;
  onOpenChat?: () => void;
  proposals: Proposal[];
  loading: boolean;
}

const NotificationsPanel = ({ onClose, onOpenChat, proposals, loading }: NotificationsPanelProps) => {
  const { user } = useAuth();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllRead = () => {
    setReadIds(new Set(proposals.map((p) => p.id!)));
  };

  const unreadCount = proposals.filter((p) => !readIds.has(p.id!)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-card shadow-2xl animate-fade-in flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-card/90 backdrop-blur-md border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-foreground">Notificaciones</h2>
            {unreadCount > 0 && (
              <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline px-2 py-1 rounded-full hover:bg-primary/10 transition-colors flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                <ArrowLeftRight className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">Todo en orden</p>
              <p className="text-muted-foreground text-sm">Cuando alguien te proponga un trueque, aparecerá aquí.</p>
            </div>
          ) : (
            proposals.map((proposal) => {
              const isUnread = !readIds.has(proposal.id!);
              
              const safeName = typeof proposal.fromUserName === 'string' ? proposal.fromUserName : "Usuario";
              const safeInitials = safeName.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase() || "US";
              const safeOffered = typeof proposal.offeredProductTitle === 'string' ? proposal.offeredProductTitle : "un artículo";
              const safeRequested = typeof proposal.requestedProductTitle === 'string' ? proposal.requestedProductTitle : "artículo";

              return (
                <div
                  key={proposal.id}
                  onClick={() => markRead(proposal.id!)}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${
                    isUnread ? "bg-primary/5" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {safeInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-tight ${isUnread ? "font-semibold text-foreground" : "text-foreground"}`}>
                      Nueva propuesta de trueque
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      <strong>{safeName}</strong> quiere intercambiar{" "}
                      <em>"{safeOffered}"</em> por tu{" "}
                      <em>"{safeRequested}"</em>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        proposal.status === "accepted" ? "bg-primary/10 text-primary" :
                        proposal.status === "rejected" ? "bg-destructive/10 text-destructive" :
                        "bg-amber-500/10 text-amber-600"
                      }`}>
                        {proposal.status === "accepted" ? "Aceptada" : proposal.status === "rejected" ? "Rechazada" : "Pendiente"}
                      </span>
                      {onOpenChat && proposal.status === "pending" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onClose(); onOpenChat(); }}
                          className="text-[10px] text-primary hover:underline"
                        >
                          Responder →
                        </button>
                      )}
                    </div>
                  </div>
                  {isUnread && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
