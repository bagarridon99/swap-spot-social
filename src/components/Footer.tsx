import { ArrowLeftRight, Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">TruequeYa</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La comunidad de trueques más grande de Chile. Intercambia lo que ya no usas por lo que necesitas. 🇨🇱
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Explorar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Categorías</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Publicaciones recientes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cerca de ti</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trueques destacados</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Comunidad</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Consejos de seguridad</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Puntos de encuentro</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Historias de éxito</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Términos de uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>© 2025 TruequeYa Chile. Todos los derechos reservados. Hecho con 💚 en Santiago.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
