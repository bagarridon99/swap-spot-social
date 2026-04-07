import { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    title: 'Bolso de cuero vintage',
    description: 'Bolso de cuero genuino estilo messenger, marca artesanal.',
    wantsInReturn: 'Mochila de trekking',
    acceptableItems: ['Mochila de trekking', 'Bolso de viaje'],
    condition: 'Como nuevo',
    category: 'Ropa',
    createdAt: '2025-03-30T10:00:00Z',
    userId: 'u1',
    userName: 'Catalina Muñoz',
    userInitials: 'CM',
    location: 'Providencia',
    region: 'Región Metropolitana',
    boosted: true,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
    title: 'Cámara analógica Fuji',
    description: 'Cámara analógica Fuji de 35mm en perfecto estado.',
    wantsInReturn: 'Lente 50mm o trípode',
    acceptableItems: ['Lente 50mm', 'Trípode profesional'],
    condition: 'Buen estado',
    category: 'Fotografía',
    createdAt: '2025-03-30T07:00:00Z',
    userId: 'u2',
    userName: 'Sebastián Díaz',
    userInitials: 'SD',
    location: 'Viña del Mar',
    region: 'Valparaíso',
  },
];

// Mock conversations — kept for reference but no longer used at runtime
export const mockConversations = [
  { id: 'c1', name: 'Catalina Muñoz', initials: 'CM', lastMessage: '¡Hola! ¿Sigue disponible?', time: '10 min', unread: 2, online: true },
];
