import { useState } from "react";
import { ArrowLeftRight, Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Mode = "login" | "register";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    if (mode === "register" && !displayName.trim()) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("¡Bienvenido de vuelta!");
      } else {
        await register(email, password, displayName.trim());
        toast.success("¡Cuenta creada! Bienvenido a TruequeYa 🎉");
      }
    } catch (err: any) {
      const msg = err?.message || "Ocurrió un error. Intenta de nuevo.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
            <ArrowLeftRight className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">TruequeYa</h1>
            <p className="text-muted-foreground text-sm mt-1">La comunidad de trueques de Chile 🇨🇱</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Tu nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Ej: Catalina Muñoz"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-9"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder={mode === "register" ? "Mínimo 6 caracteres" : "Tu contraseña"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full h-11 mt-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />{mode === "login" ? "Ingresando..." : "Creando cuenta..."}</>
              ) : (
                mode === "login" ? "Iniciar sesión" : "Crear mi cuenta gratis"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground pb-6 px-6">
            Al continuar aceptas nuestros{" "}
            <span className="text-primary cursor-pointer hover:underline">Términos de uso</span>
            {" "}y{" "}
            <span className="text-primary cursor-pointer hover:underline">Política de privacidad</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
