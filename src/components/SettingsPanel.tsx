import { useState, useEffect } from "react";
import { X, Moon, Sun, Globe, Bell, Eye, Shield, ChevronRight, LogOut, Edit, Key, BadgeCheck, Save, Loader2, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/i18n";
import { fetchProfile, updateProfile } from "@/lib/database";
import { comunasByRegion } from "@/data/chileanLocations";
import { toast } from "sonner";

interface SettingsPanelProps {
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const SettingsPanel = ({ onClose, darkMode, onToggleDarkMode }: SettingsPanelProps) => {
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Profile editing state
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profileRegion, setProfileRegion] = useState("");
  const [profileLocation, setProfileLocation] = useState("");

  // Preferences
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifProposals, setNotifProposals] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [hideLocation, setHideLocation] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const regions = Object.keys(comunasByRegion);
  const comunas = profileRegion ? (comunasByRegion[profileRegion] || []) : [];

  // Load profile on mount
  useEffect(() => {
    if (!user) return;
    setProfileLoading(true);
    fetchProfile(user.id)
      .then((profile) => {
        if (profile) {
          setDisplayName(profile.display_name || "");
          setProfileRegion(profile.region || "");
          setProfileLocation(profile.location || "");
        }
      })
      .catch(console.error)
      .finally(() => setProfileLoading(false));
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        displayName: displayName.trim(),
        region: profileRegion,
        location: profileLocation,
      });
      toast.success(t("settings.profileUpdated"));
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error(t("settings.profileError"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      onClose();
    } catch {
      toast.error(t("settings.logoutError"));
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={t("settings.title")}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[85vh] bg-card rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-display text-xl font-bold text-foreground">{t("settings.title")}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80" aria-label={t("general.close")}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] p-5 space-y-6">
          {/* Profile editing */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("settings.myProfile")}</h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" /> {t("settings.edit")}
                </button>
              )}
            </div>

            {profileLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : editMode ? (
              <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border">
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {t("settings.name")}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-lg bg-card border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder={t("settings.namePlaceholder")}
                    maxLength={50}
                  />
                </div>

                {/* Region */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {t("settings.region")}
                  </label>
                  <Select
                    value={profileRegion}
                    onValueChange={(v) => {
                      setProfileRegion(v);
                      setProfileLocation(""); // Reset comuna when region changes
                    }}
                  >
                    <SelectTrigger className="rounded-lg text-sm">
                      <SelectValue placeholder={t("settings.selectRegion")} />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Comuna */}
                {comunas.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {t("settings.comuna")}
                    </label>
                    <Select value={profileLocation} onValueChange={setProfileLocation}>
                      <SelectTrigger className="rounded-lg text-sm">
                        <SelectValue placeholder={t("settings.selectComuna")} />
                      </SelectTrigger>
                      <SelectContent>
                        {comunas.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="rounded-full flex-1 gap-1"
                    onClick={handleSaveProfile}
                    disabled={saving || !displayName.trim()}
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    {t("settings.save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setEditMode(false)}
                    disabled={saving}
                  >
                    {t("settings.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-secondary/50 border space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {displayName ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{displayName || t("settings.noName")}</p>
                    <p className="text-xs text-muted-foreground">
                      {profileLocation && profileRegion
                        ? `${profileLocation}, ${profileRegion}`
                        : profileRegion || t("settings.noLocation")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Apariencia */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("settings.appearance")}</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{t("settings.darkMode")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.darkModeDesc")}</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
            </div>
          </section>

          {/* Idioma */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("settings.languageAndRegion")}</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("settings.language")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.languageDesc")}</p>
                </div>
              </div>
              <Select value={language} onValueChange={(v) => setLanguage(v as "es" | "en")}>
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
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("settings.notifications")}</h3>
            <div className="space-y-2">
              {([
                { icon: Bell, label: t("settings.newMessages"), desc: t("settings.newMessagesDesc"), value: notifMessages, onChange: setNotifMessages },
                { icon: Bell, label: t("settings.tradeProposals"), desc: t("settings.tradeProposalsDesc"), value: notifProposals, onChange: setNotifProposals },
                { icon: Bell, label: t("settings.promotions"), desc: t("settings.promotionsDesc"), value: notifPromos, onChange: setNotifPromos },
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
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("settings.privacy")}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("settings.publicProfile")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.publicProfileDesc")}</p>
                  </div>
                </div>
                <Switch checked={profilePublic} onCheckedChange={setProfilePublic} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("settings.exactLocation")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.exactLocationDesc")}</p>
                  </div>
                </div>
                <Switch checked={hideLocation} onCheckedChange={setHideLocation} />
              </div>
            </div>
          </section>

          {/* Account actions */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("settings.account")}</h3>
            {user && (
              <p className="text-xs text-muted-foreground px-1">{t("settings.loggedInAs")} <strong>{user.email}</strong></p>
            )}
            <button
              onClick={() => toast.info(t("settings.comingSoon"))}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-foreground hover:bg-secondary/50 bg-secondary/30"
            >
              <span className="flex items-center gap-2"><Key className="h-4 w-4" /> {t("settings.changePassword")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => toast.info(t("settings.verifyComingSoon"))}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-foreground hover:bg-secondary/50 bg-secondary/30"
            >
              <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> {t("settings.verifyIdentity")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors text-destructive hover:bg-destructive/10 bg-destructive/5 border-destructive/20 disabled:opacity-60"
            >
              <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> {loggingOut ? t("settings.loggingOut") : t("settings.logout")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
