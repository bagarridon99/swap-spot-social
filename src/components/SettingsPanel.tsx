import { useState } from "react";
import { X, Moon, Sun, Globe, Bell, Eye, Shield, ChevronRight, LogOut, Edit, Key, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SettingsPanelProps {
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsPanel = ({ onClose, darkMode, onToggleDarkMode }: SettingsPanelProps) => {
  const { logout, user } = useAuth();
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifProposals, setNotifProposals] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [hideLocation, setHideLocation] = useState(false);
  const [language, setLanguage] = useState("es");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      onClose();
    } catch {
      toast.error("Error al cerrar sesión");
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-display text-xl font-bold text-foreground">Configuración</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] p-5 space-y-6">
          {/* Apariencia */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Apariencia</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-foreground">Modo oscuro</p>
                  <p className="text-xs text-muted-foreground">Cambia entre tema claro y oscuro</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
            </div>
          </section>

          {/* Idioma */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Idioma y región</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Idioma</p>
                  <p className="text-xs text-muted-foreground">Idioma de la interfaz</p>
                </div>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[130px] rounded-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español 🇨🇱</SelectItem>
                  <SelectItem value="en">English 🇺🇸</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Notificaciones */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Notificaciones</h3>
            <div className="space-y-2">
              {([
                { icon: Bell, label: "Nuevos mensajes", desc: "Cuando alguien te envía un mensaje", value: notifMessages, onChange: setNotifMessages },
                { icon: Bell, label: "Propuestas de trueque", desc: "Cuando recibes una oferta", value: notifProposals, onChange: setNotifProposals },
                { icon: Bell, label: "Promociones", desc: "Ofertas y novedades de TruequeYa", value: notifPromos, onChange: setNotifPromos },
              ] as const).map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.onChange} />
                </div>
              ))}
            </div>
          </section>

          {/* Privacidad */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Privacidad</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Perfil público</p>
                    <p className="text-xs text-muted-foreground">Otros pueden ver tu perfil</p>
                  </div>
                </div>
                <Switch checked={profilePublic} onCheckedChange={setProfilePublic} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Ubicación exacta</p>
                    <p className="text-xs text-muted-foreground">Mostrar solo zona aproximada</p>
                  </div>
                </div>
                <Switch checked={hideLocation} onCheckedChange={setHideLocation} />
              </div>
            </div>
          </section>

          {/* Account actions */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Cuenta</h3>
            {user && (
              <p className="text-xs text-muted-foreground px-1">Sesión iniciada como <strong>{user.email}</strong></p>
            )}
            <button
              onClick={() => toast.info("Función disponible próximamente")}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-foreground hover:bg-secondary/50 bg-secondary/30"
            >
              <span className="flex items-center gap-2"><Edit className="h-4 w-4" /> Editar perfil</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => toast.info("Función disponible próximamente")}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-foreground hover:bg-secondary/50 bg-secondary/30"
            >
              <span className="flex items-center gap-2"><Key className="h-4 w-4" /> Cambiar contraseña</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => toast.info("Verificación disponible próximamente")}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-foreground hover:bg-secondary/50 bg-secondary/30"
            >
              <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Verificar identidad</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-destructive hover:bg-destructive/10 bg-destructive/5 border-destructive/20 disabled:opacity-60"
            >
              <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
