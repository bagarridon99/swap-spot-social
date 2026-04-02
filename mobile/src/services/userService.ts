import { db } from './firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile } from '../types';

export interface UserStats {
  publishedCount: number;
  swapsCount: number;
  reviewsCount: number;
  rating: number;
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

export const getUserStats = async (uid: string, profile: UserProfile): Promise<UserStats> => {
  // Contar productos publicados
  const productsRef = collection(db, 'products');
  const productsQ = query(productsRef, where("user.id", "==", uid));
  const productsSnap = await getDocs(productsQ);
  const publishedCount = productsSnap.size;

  // En el futuro, swapsCount y reviewsCount también pueden calcularse dinámicamente.
  // Por ahora, asumimos que se actualizan en el documento de UserProfile cuando un negocio se cierra.
  return {
    publishedCount,
    swapsCount: profile.totalSwaps || 0,
    reviewsCount: profile.totalReviews || 0,
    rating: profile.rating || 0,
  };
};
