import { useState } from "react";
import { Search, Bell, MessageCircle, Plus, ArrowLeftRight, Heart, Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MarketplaceHeaderProps {
  onPublish: () => void;
  onNotifications: () => void;
  onChat: () => void;
  onSaved: () => void;
  onPricing: () => void;
  onSettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const MarketplaceHeader = ({ onPublish, onNotifications, onChat, onSaved, onPricing, searchQuery, onSearchChange }: MarketplaceHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">TruequeYa</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Chile 🇨🇱</span>
        </div>

        <div className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar artículos para intercambiar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full bg-secondary pl-10 pr-4 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="hidden lg:flex gap-1.5 rounded-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:text-amber-600"
            onClick={onPricing}
          >
            <Crown className="h-4 w-4" />
            Premium
          </Button>
          <Button size="sm" className="hidden sm:flex gap-1.5 rounded-full" onClick={onPublish}>
            <Plus className="h-4 w-4" />
            Publicar
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onSaved}>
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative" onClick={onNotifications}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative" onClick={onChat}>
            <MessageCircle className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              TU
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
