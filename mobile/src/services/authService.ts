/**
 * Auth Service
 * Handles Firebase Authentication operations.
 */

import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  if (!userCredential.user.emailVerified) {
    await firebaseSignOut(auth);
    throw new Error('Por favor, verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o SPAM.');
  }

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.displayName || email.split('@')[0],
  };
};

export const registerWithEmail = async (
  email: string,
  password: string,
  userData: { name: string; region: string }
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Send email verification
  await sendEmailVerification(userCredential.user);
  
  // Set the display name
  await updateProfile(userCredential.user, {
    displayName: userData.name
  });

  // Create initial user document in Firestore
  const initialProfile: UserProfile = {
    id: userCredential.user.uid,
    name: userData.name,
    initials: userData.name.substring(0, 2).toUpperCase(),
    email: email,
    location: 'Sede / General', // Can be refined later
    region: userData.region,
    rating: 0,
    totalReviews: 0,
    totalSwaps: 0,
    memberSince: new Date().getFullYear().toString(),
    bio: '¡Nuevo miembro en PermutApp!',
    verified: false, // Wait until they verify email, but by default false initially
    responseRate: 100,
    responseTime: '< 1 hora'
  };

  await setDoc(doc(db, 'users', userCredential.user.uid), initialProfile);

  // Sign out because we require verification
  await firebaseSignOut(auth);

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userData.name,
  };
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};
