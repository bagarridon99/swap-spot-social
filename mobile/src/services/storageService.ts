/**
 * Storage Service
 * Handles Firebase Storage operations for image uploads.
 * Currently uses mock implementation for development.
 */

// import { storage } from './firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (
  _uri: string,
  _path: string
): Promise<string> => {
  // Mock: simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return `https://firebasestorage.example.com/${_path}`;
};

export const uploadMultipleImages = async (
  uris: string[],
  basePath: string
): Promise<string[]> => {
  const urls = await Promise.all(
    uris.map((uri, index) => uploadImage(uri, `${basePath}/${index}`))
  );
  return urls;
};
