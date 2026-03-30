import productBag from "@/assets/product-bag.jpg";
import productCamera from "@/assets/product-camera.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productBike from "@/assets/product-bike.jpg";
import productGuitar from "@/assets/product-guitar.jpg";
import productBooks from "@/assets/product-books.jpg";

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  location: string;
  region: string;
  rating: number;
  totalReviews: number;
  totalSwaps: number;
  memberSince: string;
  bio: string;
  verified: boolean;
  responseRate: number;
  responseTime: string;
}

export interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  wantsInReturn: string;
  acceptableItems: string[];
  condition: string;
  category: string;
  timeAgo: string;
  user: UserProfile;
  saved?: boolean;
  views?: number;
  boosted?: boolean;
  premium?: boolean;
}

export const chileanRegions = [
  "Región Metropolitana",
  "Valparaíso",
  "Biobío",
  "Araucanía",
  "Los Lagos",
  "O'Higgins",
  "Maule",
  "Coquimbo",
  "Antofagasta",
  "Los Ríos",
];

export const mockUsers: UserProfile[] = [
  {
    id: "u1",
    name: "Catalina Muñoz",
    initials: "CM",
    location: "Providencia",
    region: "Región Metropolitana",
    rating: 4.8,
    totalReviews: 32,
    totalSwaps: 28,
    memberSince: "Marzo 2024",
    bio: "Amante de la moda vintage y los viajes. Siempre buscando piezas únicas en ferias de Lastarria.",
    verified: true,
    responseRate: 95,
    responseTime: "~1 hora",
  },
  {
    id: "u2",
    name: "Sebastián Díaz",
    initials: "SD",
    location: "Viña del Mar",
    region: "Valparaíso",
    rating: 4.5,
    totalReviews: 18,
    totalSwaps: 15,
    memberSince: "Junio 2024",
    bio: "Fotógrafo aficionado. Colecciono cámaras analógicas y equipos vintage. 📸",
    verified: true,
    responseRate: 88,
    responseTime: "~3 horas",
  },
  {
    id: "u3",
    name: "Francisca Soto",
    initials: "FS",
    location: "Ñuñoa",
    region: "Región Metropolitana",
    rating: 5.0,
    totalReviews: 12,
    totalSwaps: 10,
    memberSince: "Enero 2025",
    bio: "Deportista y runner. Me encanta renovar mi armario sin gastar. 🏃‍♀️",
    verified: false,
    responseRate: 100,
    responseTime: "~30 min",
  },
  {
    id: "u4",
    name: "Matías Vergara",
    initials: "MV",
    location: "Concepción",
    region: "Biobío",
    rating: 4.2,
    totalReviews: 8,
    totalSwaps: 6,
    memberSince: "Septiembre 2024",
    bio: "Aventurero de fin de semana. Intercambio equipos de deporte y camping.",
    verified: true,
    responseRate: 78,
    responseTime: "~6 horas",
  },
  {
    id: "u5",
    name: "Valentina Rojas",
    initials: "VR",
    location: "La Serena",
    region: "Coquimbo",
    rating: 4.9,
    totalReviews: 45,
    totalSwaps: 40,
    memberSince: "Noviembre 2023",
    bio: "La música es mi vida. Intercambio instrumentos y vinilos. 🎵",
    verified: true,
    responseRate: 97,
    responseTime: "~45 min",
  },
  {
    id: "u6",
    name: "Tomás Herrera",
    initials: "TH",
    location: "Las Condes",
    region: "Región Metropolitana",
    rating: 4.6,
    totalReviews: 22,
    totalSwaps: 19,
    memberSince: "Abril 2024",
    bio: "Lector voraz y coleccionista de cómics. Siempre buscando nuevas historias.",
    verified: true,
    responseRate: 92,
    responseTime: "~2 horas",
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    image: productBag,
    title: "Bolso de cuero vintage",
    description:
      "Bolso de cuero genuino estilo messenger, marca artesanal. Tiene compartimentos interiores para notebook de hasta 13 pulgadas. Color marrón coñac. Apenas usado, sin rasguños visibles. Lo compré en una feria de Bellavista.",
    wantsInReturn: "Mochila de trekking",
    acceptableItems: ["Mochila de trekking", "Bolso de viaje", "Maleta de cabina", "Riñonera de cuero"],
    condition: "Como nuevo",
    category: "Ropa",
    timeAgo: "Hace 2 horas",
    user: mockUsers[0],
    views: 124,
    boosted: true,
    premium: true,
  },
  {
    id: 2,
    image: productCamera,
    title: "Cámara analógica Fuji",
    description:
      "Cámara analógica Fuji de 35mm en perfecto estado de funcionamiento. Incluye funda original y correa. Ideal para iniciarse en la fotografía analógica o como pieza de colección.",
    wantsInReturn: "Lente 50mm o trípode",
    acceptableItems: ["Lente 50mm", "Trípode profesional", "Flash externo", "Otra cámara analógica"],
    condition: "Buen estado",
    category: "Fotografía",
    timeAgo: "Hace 5 horas",
    user: mockUsers[1],
    views: 89,
  },
  {
    id: 3,
    image: productSneakers,
    title: "Zapatillas blancas talla 42",
    description:
      "Zapatillas blancas minimalistas, talla 42. Sin estrenar, vienen con caja original. Estilo clásico que combina con todo. Las compré en el Costanera Center pero me quedaron grandes.",
    wantsInReturn: "Zapatillas de running",
    acceptableItems: ["Zapatillas de running", "Botas de montaña", "Sandalias de marca", "Zapatos formales"],
    condition: "Nuevo",
    category: "Ropa",
    timeAgo: "Hace 1 día",
    user: mockUsers[2],
    views: 210,
  },
  {
    id: 4,
    image: productBike,
    title: 'Bicicleta de montaña 29"',
    description:
      "Mountain bike con ruedas de 29 pulgadas, cuadro de aluminio, frenos de disco hidráulicos y cambios Shimano de 21 velocidades. Perfecta para rutas en el Cajón del Maipo o cerro San Cristóbal.",
    wantsInReturn: "Patinete eléctrico o kayak",
    acceptableItems: ["Patinete eléctrico", "Kayak", "Tabla de surf", "Equipo de esquí"],
    condition: "Buen estado",
    category: "Deportes",
    timeAgo: "Hace 3 horas",
    user: mockUsers[3],
    views: 156,
  },
  {
    id: 5,
    image: productGuitar,
    title: "Guitarra acústica Yamaha",
    description:
      "Guitarra acústica Yamaha F310, tapa de abeto, aros y fondo de meranti. Sonido cálido y equilibrado. Incluye funda acolchada y juego de cuerdas extra.",
    wantsInReturn: "Teclado o ukelele",
    acceptableItems: ["Teclado electrónico", "Ukelele", "Armónica profesional", "Cajón peruano"],
    condition: "Como nuevo",
    category: "Música",
    timeAgo: "Hace 8 horas",
    user: mockUsers[4],
    views: 98,
  },
  {
    id: 6,
    image: productBooks,
    title: "Colección novelas clásicas",
    description:
      "Colección de 8 novelas clásicas en tapa dura: Don Quijote, Cien años de soledad, 1984, El principito, y más. Ediciones de calidad con buena encuadernación.",
    wantsInReturn: "Comics o manga",
    acceptableItems: ["Colección de manga", "Comics Marvel/DC", "Novela gráfica", "Libros de arte"],
    condition: "Buen estado",
    category: "Libros",
    timeAgo: "Hace 1 día",
    user: mockUsers[5],
    views: 67,
  },
];
