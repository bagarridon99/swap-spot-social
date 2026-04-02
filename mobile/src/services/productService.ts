/**
 * Product Service
 * Handles Firestore operations for products.
 */

import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

export const getProducts = async (category?: string): Promise<Product[]> => {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  let q = query(productsRef);
  
  if (category && category !== 'Todo') {
    q = query(productsRef, where('category', '==', category));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

export const searchProducts = async (searchQuery: string): Promise<Product[]> => {
  // Free text search in Firestore requires third party but we can simulate a naive locally
  const products = await getProducts();
  const lowerQuery = searchQuery.toLowerCase();
  
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );
};

export const createProduct = async (
  productData: Omit<Product, 'id' | 'createdAt' | 'timeAgo' | 'views' | 'images'>,
  images: string[]
): Promise<string> => {
  // images here are already uploaded URLs (or handled elsewhere for now)
  const fullProductData = {
    ...productData,
    images,
    createdAt: new Date().toISOString(),
    timeAgo: 'Justo ahora',
    views: 0
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), fullProductData);
  return docRef.id;
};

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  const q = query(collection(db, PRODUCTS_COLLECTION), where('user.id', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};
