import { X, ArrowLeftRight, MessageCircle, Star, UserPlus, Package } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NotificationsPanelProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    icon: ArrowLeftRight,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Nueva propuesta de trueque",
    description: "Catalina Muñoz quiere intercambiar contigo",
    time: "Hace 10 min",
    unread: true,
    initials: "CM",
  },
  {
    id: 2,
    icon: MessageCircle,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Nuevo mensaje",
    description: "Sebastián Díaz: \"¿Sigue disponible la guitarra?\"",
    time: "Hace 30 min",
    unread: true,
    initials: "SD",
  },
  {
    id: 3,
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    title: "Nueva reseña",
    description: "Francisca te dejó una reseña de 5 estrellas ⭐",
    time: "Hace 2 horas",
    unread: false,
    initials: "FS",
  },
  {
    id: 4,
    icon: Package,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Trueque completado",
    description: "Tu intercambio con Matías fue confirmado 🎉",
    time: "Hace 1 día",
    unread: false,
    initials: "MV",
  },
  {
    id: 5,
    icon: UserPlus,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    title: "Nuevo seguidor",
    description: "Valentina Rojas comenzó a seguirte",
    time: "Hace 2 días",
    unread: false,
    initials: "VR",
  },
];

const NotificationsPanel = ({ onClose }: NotificationsPanelProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-card shadow-2xl animate-fade-in overflow-y-auto">
        <div className="sticky top-0 bg-card/90 backdrop-blur-md border-b p-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">Notificaciones</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="divide-y">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${n.unread ? "bg-primary/5" : ""}`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className={`${n.iconBg} ${n.iconColor} text-xs font-semibold`}>
                    {n.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${n.unread ? "font-semibold text-foreground" : "text-foreground"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                {n.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
