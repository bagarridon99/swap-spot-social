import { X, Moon, Sun, Globe, Bell, Eye, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsPanelProps {
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsPanel = ({ onClose, darkMode, onToggleDarkMode }: SettingsPanelProps) => {
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
              <Select defaultValue="es">
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
              {[
                { icon: Bell, label: "Nuevos mensajes", desc: "Cuando alguien te envía un mensaje", defaultChecked: true },
                { icon: Bell, label: "Propuestas de trueque", desc: "Cuando recibes una oferta", defaultChecked: true },
                { icon: Bell, label: "Promociones", desc: "Ofertas y novedades de TruequeYa", defaultChecked: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
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
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Ubicación exacta</p>
                    <p className="text-xs text-muted-foreground">Mostrar solo zona aproximada</p>
                  </div>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </section>

          {/* Account actions */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Cuenta</h3>
            {["Editar perfil", "Cambiar contraseña", "Verificar identidad", "Cerrar sesión"].map((action) => (
              <button
                key={action}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors
                  ${action === "Cerrar sesión"
                    ? "text-destructive hover:bg-destructive/10 bg-destructive/5 border-destructive/20"
                    : "text-foreground hover:bg-secondary/50 bg-secondary/30"
                  }`}
              >
                {action}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
