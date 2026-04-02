import { useState, useEffect, useRef } from "react";
import { X, Send, ArrowLeft, Image } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeChats,
  subscribeMessages,
  sendMessage,
  markChatRead,
  type Chat,
  type ChatMessage,
} from "@/lib/firestore";

interface ChatPanelProps {
  onClose: () => void;
}

const ChatPanel = ({ onClose }: ChatPanelProps) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to chats
  useEffect(() => {
    if (!user) return;
    return subscribeChats(user.uid, setChats);
  }, [user]);

  // Subscribe to messages of active chat
  useEffect(() => {
    if (!activeChat) return;
    return subscribeMessages(activeChat, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  }, [activeChat]);

  // Mark chat as read when opened
  useEffect(() => {
    if (activeChat && user) {
      markChatRead(activeChat, user.uid);
    }
  }, [activeChat, user]);

  const activeConv = chats.find((c) => c.id === activeChat);
  const otherUserId = activeConv?.participants.find((p) => p !== user?.uid) || "";
  const otherName = activeConv?.participantNames?.[otherUserId] || "Usuario";
  const otherInitials = activeConv?.participantInitials?.[otherUserId] || "??";

  const handleSend = async () => {
    if (!message.trim() || !activeChat || !user) return;
    const text = message.trim();
    setMessage("");
    await sendMessage(activeChat, user.uid, text, otherUserId);
  };

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
                  {otherInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{otherName}</p>
              </div>
            </>
          ) : (
            <h2 className="font-display text-lg font-bold text-foreground flex-1">Mensajes</h2>
          )}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {!activeChat ? (
          /* Conversation list */
          <div className="flex-1 overflow-y-auto divide-y">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-muted-foreground text-sm">No tienes conversaciones aún</p>
                <p className="text-xs text-muted-foreground mt-1">Propón un trueque para iniciar un chat</p>
              </div>
            ) : (
              chats.map((conv) => {
                const otherId = conv.participants.find((p) => p !== user?.uid) || "";
                const name = conv.participantNames?.[otherId] || "Usuario";
                const initials = conv.participantInitials?.[otherId] || "??";
                const isUnread = conv.unreadBy?.includes(user?.uid || "");

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveChat(conv.id!)}
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{conv.lastMessage || "Sin mensajes"}</p>
                    </div>
                    {isUnread && (
                      <span className="h-3 w-3 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Chat messages */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">Envía el primer mensaje</p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                      msg.senderId === user?.uid
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.senderId === user?.uid ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.createdAt?.toDate?.()?.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) || "..."}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-3 flex items-center gap-2">
              <Input
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) handleSend();
                }}
              />
              <Button size="icon" className="shrink-0 rounded-full" onClick={handleSend}>
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
