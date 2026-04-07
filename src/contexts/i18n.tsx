import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Dictionaries ──────────────────────────────────────────────────────────────

const dictionaries: Record<string, Record<string, string>> = {
  es: {
    // Header
    "header.search": "Buscar artículos para intercambiar...",
    "header.publish": "Publicar",
    "header.premium": "Premium",
    "header.logout": "Cerrar sesión",
    "header.sessionClosed": "Sesión cerrada",
    // Settings
    "settings.title": "Configuración",
    "settings.myProfile": "Mi Perfil",
    "settings.edit": "Editar",
    "settings.name": "Nombre",
    "settings.namePlaceholder": "Tu nombre",
    "settings.region": "Región",
    "settings.selectRegion": "Selecciona región",
    "settings.comuna": "Comuna",
    "settings.selectComuna": "Selecciona comuna",
    "settings.save": "Guardar",
    "settings.cancel": "Cancelar",
    "settings.noName": "Sin nombre",
    "settings.noLocation": "Sin ubicación",
    "settings.appearance": "Apariencia",
    "settings.darkMode": "Modo oscuro",
    "settings.darkModeDesc": "Cambia entre tema claro y oscuro",
    "settings.languageAndRegion": "Idioma y región",
    "settings.language": "Idioma",
    "settings.languageDesc": "Idioma de la interfaz",
    "settings.notifications": "Notificaciones",
    "settings.newMessages": "Nuevos mensajes",
    "settings.newMessagesDesc": "Cuando alguien te envía un mensaje",
    "settings.tradeProposals": "Propuestas de trueque",
    "settings.tradeProposalsDesc": "Cuando recibes una oferta",
    "settings.promotions": "Promociones",
    "settings.promotionsDesc": "Ofertas y novedades de TruequeYa",
    "settings.privacy": "Privacidad",
    "settings.publicProfile": "Perfil público",
    "settings.publicProfileDesc": "Otros pueden ver tu perfil",
    "settings.exactLocation": "Ubicación exacta",
    "settings.exactLocationDesc": "Mostrar solo zona aproximada",
    "settings.account": "Cuenta",
    "settings.loggedInAs": "Sesión iniciada como",
    "settings.changePassword": "Cambiar contraseña",
    "settings.verifyIdentity": "Verificar identidad",
    "settings.logout": "Cerrar sesión",
    "settings.loggingOut": "Cerrando sesión...",
    "settings.profileUpdated": "¡Perfil actualizado!",
    "settings.profileError": "Error al guardar el perfil",
    "settings.logoutError": "Error al cerrar sesión",
    "settings.comingSoon": "Función disponible próximamente",
    "settings.verifyComingSoon": "Verificación disponible próximamente",
    // Publish
    "publish.title": "Publicar artículo",
    "publish.uploadPhoto": "Haz clic o arrastra para subir fotos",
    "publish.uploadHint": "JPG, PNG — Hasta 5 imágenes",
    "publish.itemTitle": "Título del artículo *",
    "publish.description": "Descripción *",
    "publish.category": "Categoría *",
    "publish.condition": "Condición *",
    "publish.select": "Seleccionar",
    "publish.region": "Región *",
    "publish.selectRegion": "Selecciona tu región",
    "publish.comuna": "Comuna *",
    "publish.selectComuna": "Selecciona tu comuna",
    "publish.wantsInReturn": "¿Qué te gustaría recibir a cambio? *",
    "publish.acceptableItems": "Artículos aceptables (opcional)",
    "publish.addOptions": "Agrega opciones...",
    "publish.cancel": "Cancelar",
    "publish.submit": "Publicar",
    "publish.submitting": "Publicando...",
    "publish.fillRequired": "Por favor completa todos los campos obligatorios",
    "publish.selectComuna2": "Por favor selecciona tu comuna",
    "publish.uploadImage": "Sube al menos una imagen de tu artículo",
    "publish.success": "¡Publicación creada! Tu artículo ya está visible para otros usuarios.",
    "publish.error": "Error al publicar: ",
    // General
    "general.close": "Cerrar",
  },
  en: {
    // Header
    "header.search": "Search items to trade...",
    "header.publish": "Publish",
    "header.premium": "Premium",
    "header.logout": "Log out",
    "header.sessionClosed": "Logged out",
    // Settings
    "settings.title": "Settings",
    "settings.myProfile": "My Profile",
    "settings.edit": "Edit",
    "settings.name": "Name",
    "settings.namePlaceholder": "Your name",
    "settings.region": "Region",
    "settings.selectRegion": "Select region",
    "settings.comuna": "City",
    "settings.selectComuna": "Select city",
    "settings.save": "Save",
    "settings.cancel": "Cancel",
    "settings.noName": "No name",
    "settings.noLocation": "No location",
    "settings.appearance": "Appearance",
    "settings.darkMode": "Dark mode",
    "settings.darkModeDesc": "Switch between light and dark theme",
    "settings.languageAndRegion": "Language & region",
    "settings.language": "Language",
    "settings.languageDesc": "Interface language",
    "settings.notifications": "Notifications",
    "settings.newMessages": "New messages",
    "settings.newMessagesDesc": "When someone sends you a message",
    "settings.tradeProposals": "Trade proposals",
    "settings.tradeProposalsDesc": "When you receive an offer",
    "settings.promotions": "Promotions",
    "settings.promotionsDesc": "Deals and news from TruequeYa",
    "settings.privacy": "Privacy",
    "settings.publicProfile": "Public profile",
    "settings.publicProfileDesc": "Others can see your profile",
    "settings.exactLocation": "Exact location",
    "settings.exactLocationDesc": "Show approximate area only",
    "settings.account": "Account",
    "settings.loggedInAs": "Logged in as",
    "settings.changePassword": "Change password",
    "settings.verifyIdentity": "Verify identity",
    "settings.logout": "Log out",
    "settings.loggingOut": "Logging out...",
    "settings.profileUpdated": "Profile updated!",
    "settings.profileError": "Error saving profile",
    "settings.logoutError": "Error logging out",
    "settings.comingSoon": "Feature coming soon",
    "settings.verifyComingSoon": "Verification coming soon",
    // Publish
    "publish.title": "Publish item",
    "publish.uploadPhoto": "Click or drag to upload photos",
    "publish.uploadHint": "JPG, PNG — Up to 5 images",
    "publish.itemTitle": "Item title *",
    "publish.description": "Description *",
    "publish.category": "Category *",
    "publish.condition": "Condition *",
    "publish.select": "Select",
    "publish.region": "Region *",
    "publish.selectRegion": "Select your region",
    "publish.comuna": "City *",
    "publish.selectComuna": "Select your city",
    "publish.wantsInReturn": "What would you like in return? *",
    "publish.acceptableItems": "Acceptable items (optional)",
    "publish.addOptions": "Add options...",
    "publish.cancel": "Cancel",
    "publish.submit": "Publish",
    "publish.submitting": "Publishing...",
    "publish.fillRequired": "Please fill in all required fields",
    "publish.selectComuna2": "Please select your city",
    "publish.uploadImage": "Upload at least one image of your item",
    "publish.success": "Listing created! Your item is now visible to others.",
    "publish.error": "Error publishing: ",
    // General
    "general.close": "Close",
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

type Language = "es" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("truequeya-lang");
      if (stored === "en" || stored === "es") return stored;
    }
    return "es";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("truequeya-lang", lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return dictionaries[language]?.[key] ?? dictionaries["es"]?.[key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
