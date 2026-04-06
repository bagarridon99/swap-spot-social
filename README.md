# 🔄 TruequeYa — La comunidad de trueques más grande de Chile

> Intercambia lo que ya no usas. Encuentra lo que necesitas. Sin dinero de por medio. 🇨🇱

![TruequeYa Banner](public/placeholder.svg)

---

##  Descripción

**TruequeYa** es una plataforma web y móvil de intercambio de artículos entre personas, pensada y construida para Chile. El concepto es simple: publicas lo que ya no usas, describes qué estás buscando a cambio, y conectas con personas que tienen justo lo que necesitas.

Con un modo **Descubrir** estilo Tinder (swipe derecha = me interesa, swipe izquierda = pasar), filtros por región y comuna, chat en tiempo real y un sistema de propuestas de trueque, TruequeYa hace que el intercambio sea fácil, social y divertido.

---

##  Funcionalidades

###  Marketplace
- Feed principal con publicaciones en tiempo real desde Firestore
- Filtro por **categorías** (Ropa, Tecnología, Deportes, Música, Libros, etc.)
- Filtro por **región** y **comuna** con datos reales de Chile
- Buscador de artículos por título, descripción o lo que buscan a cambio
- Tarjetas con imagen, condición del artículo, usuario y ubicación
- **Publicaciones destacadas (Boosted)** que aparecen primero en el feed

###  Modo Descubrir (estilo Tinder)
- Swipe interactivo con soporte para **touch y mouse**
- Swipe a la derecha → guardar artículo
- Swipe a la izquierda → descartar
- Botón de **deshacer** para volver al artículo anterior
- Animaciones de transición según dirección del swipe

###  Propuesta de Trueque
- Selecciona uno de tus artículos publicados para ofrecer
- Agrega un mensaje personalizado
- La propuesta se envía al dueño del artículo **y** se crea automáticamente un chat con el primer mensaje

###  Chat en Tiempo Real
- Sistema de mensajería integrado con **Firestore** (listeners en tiempo real)
- Lista de conversaciones activas con preview del último mensaje
- Indicador de mensajes no leídos
- Soporte para adjuntar imágenes
- Marcado automático de mensajes como leídos al abrir una conversación

###  Explorador de Mapa
- Mapa interactivo con **React Leaflet** mostrando artículos por comuna
- Agrupación de publicaciones por ubicación geográfica
- Filtro por categoría directamente en el mapa
- Coordenadas reales de comunas chilenas

###  Eventos de Trueque
- Calendario de ferias y eventos de intercambio en Chile
- Información de ubicación, horario, organizador y cupos disponibles
- Botón para registrarse en eventos
- Datos reales de eventos en Santiago y regiones

###  Notificaciones
- Panel de notificaciones con actividad reciente
- Alertas de propuestas recibidas, matches y mensajes nuevos

###  Historial de Trueques
- Registro de intercambios completados y en curso
- Detalle de artículos intercambiados y con quién

###  Artículos Guardados
- Colección de artículos marcados como favoritos
- Persistencia en sesión

###  Planes Premium
- **Plan Gratis**: hasta 5 publicaciones, 3 fotos, chat básico
- **Plan Premium** ($4.990/mes): publicaciones ilimitadas, 10 fotos, badge dorado, destacados gratuitos, estadísticas, prioridad en búsquedas y sin publicidad
- **Plan Pro** ($9.990/mes): todo Premium + API access, soporte prioritario y cuenta de marca verificada

###  Boost de Publicaciones
- Destaca publicaciones individuales por 7 o 30 días
- Las publicaciones boosteadas aparecen primero en el feed y el mapa

###  Configuración
- Modo oscuro / claro con persistencia en `localStorage`
- Panel de ajustes de perfil y privacidad
- Toggle de notificaciones

###  Autenticación
- Login y registro con **Firebase Authentication**
- Contexto de autenticación global con `AuthContext`
- Rutas protegidas: la app solo es accesible para usuarios autenticados

###  App Móvil (React Native + Expo)
- App nativa para **iOS y Android** con Expo
- Navegación con React Navigation (stack + bottom tabs)
- Pantallas: Feed, Detalle de producto, Chat, Bandeja de entrada, Perfil, Publicar
- Componentes atómicos reutilizables (Avatar, Badge, CategoryChip, CustomInput, etc.)
- Conexión a Firebase (Auth, Firestore, Storage)
- Selector de imágenes con `expo-image-picker`

---

## 🛠️ Stack Tecnológico

### Web (Vite + React)
| Tecnología | Uso |
|---|---|
| **React 18** | UI Framework |
| **TypeScript** | Tipado estático |
| **Vite** | Bundler y dev server |
| **Tailwind CSS v3** | Estilos utilitarios |
| **shadcn/ui + Radix UI** | Componentes accesibles |
| **Firebase v12** | Auth, Firestore, Storage |
| **TanStack Query** | Estado del servidor y caché |
| **React Router DOM v6** | Routing |
| **React Leaflet** | Mapas interactivos |
| **Sonner** | Notificaciones toast |
| **React Hook Form + Zod** | Formularios y validación |
| **Recharts** | Gráficos y estadísticas |
| **Lucide React** | Iconografía |
| **Vitest + Testing Library** | Tests unitarios |
| **Playwright** | Tests E2E |

### Móvil (React Native + Expo)
| Tecnología | Uso |
|---|---|
| **Expo SDK 54** | Framework móvil |
| **React Native 0.81** | UI nativa |
| **React Navigation v7** | Navegación (stack + tabs) |
| **Firebase v12** | Auth, Firestore, Storage |
| **Expo Image Picker** | Subida de imágenes |
| **Expo Linear Gradient** | Gradientes UI |
| **TypeScript** | Tipado estático |

### Backend / Infraestructura
| Servicio | Uso |
|---|---|
| **Firebase Authentication** | Login y registro de usuarios |
| **Cloud Firestore** | Base de datos en tiempo real |
| **Firebase Storage** | Almacenamiento de imágenes |

---

##  Estructura del Proyecto

```
swap-spot-social/
├── src/                          # App web (Vite + React)
│   ├── components/               # Componentes principales
│   │   ├── ui/                   # Componentes shadcn/ui
│   │   ├── DiscoverMode.tsx      # Modo swipe estilo Tinder
│   │   ├── TruequeProposal.tsx   # Flujo de propuesta de trueque
│   │   ├── ChatPanel.tsx         # Chat en tiempo real
│   │   ├── MapExplorer.tsx       # Mapa interactivo con Leaflet
│   │   ├── MarketplaceHeader.tsx # Header con navegación global
│   │   ├── PublishModal.tsx      # Modal para publicar artículo
│   │   ├── PricingModal.tsx      # Planes Premium
│   │   ├── BoostModal.tsx        # Destacar publicaciones
│   │   ├── TradeEvents.tsx       # Eventos y ferias de trueque
│   │   ├── TradeHistory.tsx      # Historial de intercambios
│   │   ├── NotificationsPanel.tsx
│   │   ├── SavedItems.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── RegionFilter.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SponsoredCard.tsx     # Anuncios patrocinados
│   │   ├── HowItWorks.tsx
│   │   └── Footer.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx       # Contexto global de autenticación
│   ├── lib/
│   │   ├── firestore.ts          # Lógica de acceso a Firestore
│   │   └── utils.ts
│   ├── data/
│   │   ├── mockProducts.ts       # Datos de ejemplo
│   │   └── chileanLocations.ts   # Regiones, comunas y coordenadas
│   ├── pages/
│   │   ├── Index.tsx             # Página principal
│   │   ├── AuthPage.tsx          # Login / Registro
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   └── use-mobile.tsx
│   └── test/                     # Tests unitarios
│
└── mobile/                       # App móvil (React Native + Expo)
    ├── src/
    │   ├── screens/
    │   │   ├── auth/             # Login y Registro
    │   │   ├── feed/             # Feed y detalle de producto
    │   │   ├── chat/             # Chat e Inbox
    │   │   ├── profile/          # Perfil de usuario
    │   │   └── publish/          # Publicar artículo
    │   ├── components/
    │   │   ├── atoms/            # Avatar, Badge, CategoryChip, etc.
    │   │   ├── molecules/        # ProductCard, ChatBubble, SearchBar
    │   │   └── organisms/        # CategoryFilter
    │   ├── navigation/           # Navegación con React Navigation
    │   ├── services/             # Firebase Auth, Firestore, Storage
    │   ├── context/              # AuthContext móvil
    │   ├── types/                # Tipos TypeScript
    │   ├── data/                 # Categorías y datos chilenos
    │   └── constants/            # Colores, tipografía, layout
    └── assets/                   # Íconos y splash screen
```

---

##  Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Bun (recomendado) o npm
- Cuenta en [Firebase](https://firebase.google.com/) con proyecto configurado

### 1. Clonar el repositorio
```bash
git clone https://github.com/bagarridon99/swap-spot-social.git
cd swap-spot-social
```

### 2. Instalar dependencias (Web)
```bash
bun install
# o
npm install
```

### 3. Configurar Firebase
El proyecto ya incluye una configuración de Firebase en `mobile/src/services/firebase.ts`. Para el cliente web, asegúrate de que `src/lib/firestore.ts` apunte a tu proyecto de Firebase.

Crea las colecciones en Firestore:
- `products` — publicaciones de artículos
- `chats` — conversaciones entre usuarios
- `messages` — mensajes dentro de cada chat
- `proposals` — propuestas de trueque enviadas

### 4. Ejecutar en desarrollo (Web)
```bash
bun dev
# o
npm run dev
```
La app estará disponible en `http://localhost:5173`

### 5. Ejecutar la app móvil
```bash
cd mobile
npm install
npx expo start
```
Escanea el QR con la app **Expo Go** en tu celular, o presiona `a` para Android / `i` para iOS.

### 6. Build para producción (Web)
```bash
bun run build
# o
npm run build
```

---

##  Tests

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests E2E con Playwright
npx playwright test
```

---

## Roadmap

- [ ] Sistema de calificaciones y reputación de usuarios
- [ ] Verificación de identidad
- [ ] Notificaciones push (web y móvil)
- [ ] Matching automático por intereses declarados
- [ ] Integración con medios de pago para plan Premium
- [ ] Panel de administración
- [ ] Historial de trueques con estado (pendiente / completado / rechazado)
- [ ] Soporte para video en publicaciones

---

##  Contribuir

¡Las contribuciones son bienvenidas! Si quieres aportar:

1. Haz un fork del repositorio
2. Crea tu branch: `git checkout -b feature/mi-feature`
3. Haz commit de tus cambios: `git commit -m 'feat: agrego mi feature'`
4. Push al branch: `git push origin feature/mi-feature`
5. Abre un Pull Request

---

##  Licencia

Este proyecto está bajo la licencia MIT. Mira el archivo `LICENSE` para más detalles.

---

<div align="center">
  Hecho con ❤️ en Chile 🇨🇱
</div>
