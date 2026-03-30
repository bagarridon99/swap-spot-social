import { useState } from "react";
import { X, Send, ArrowLeft, Image } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatPanelProps {
  onClose: () => void;
}

const conversations = [
  { id: 1, name: "Catalina Muñoz", initials: "CM", lastMessage: "¡Hola! ¿Sigue disponible el bolso?", time: "10 min", unread: 2, online: true },
  { id: 2, name: "Sebastián Díaz", initials: "SD", lastMessage: "Perfecto, nos juntamos en metro Tobalaba", time: "30 min", unread: 0, online: true },
  { id: 3, name: "Francisca Soto", initials: "FS", lastMessage: "Gracias por el trueque! 🙌", time: "2 horas", unread: 0, online: false },
  { id: 4, name: "Matías Vergara", initials: "MV", lastMessage: "¿Te sirve el sábado?", time: "1 día", unread: 1, online: false },
];

const mockMessages = [
  { id: 1, sender: "them", text: "¡Hola! Vi tu publicación del bolso de cuero, ¿sigue disponible?", time: "14:20" },
  { id: 2, sender: "me", text: "¡Hola! Sí, todavía lo tengo 😊", time: "14:22" },
  { id: 3, sender: "them", text: "Bacán! Tengo una mochila de trekking Doite que podría interesarte", time: "14:23" },
  { id: 4, sender: "me", text: "¡Me interesa! ¿Puedes mandarme fotos?", time: "14:25" },
  { id: 5, sender: "them", text: "Claro que sí, te las mando altiro", time: "14:26" },
];

const ChatPanel = ({ onClose }: ChatPanelProps) => {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const activeConv = conversations.find(c => c.id === activeChat);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-card shadow-2xl animate-fade-in flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-card/90 backdrop-blur-md border-b p-4 flex items-center gap-3">
          {activeChat ? (
            <>
              <button onClick={() => setActiveChat(null)} className="p-1 rounded-full hover:bg-secondary">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {activeConv?.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{activeConv?.name}</p>
                {activeConv?.online && <p className="text-[11px] text-primary">En línea</p>}
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display text-lg font-bold text-foreground flex-1">Mensajes</h2>
            </>
          )}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {!activeChat ? (
          /* Conversation list */
          <div className="flex-1 overflow-y-auto divide-y">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveChat(conv.id)}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                      {conv.initials}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-foreground">{conv.name}</p>
                    <span className="text-[11px] text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Chat messages */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
                <Image className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Input
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    setMessage("");
                  }
                }}
              />
              <Button size="icon" className="shrink-0 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
