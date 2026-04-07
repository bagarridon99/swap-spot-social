/**
 * Storage Service — Supabase Storage
 */
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const uploadImage = async (
  uri: string,
  path: string
): Promise<string> => {
  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const filePath = `${path}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from('products')
    .upload(filePath, decode(base64), {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('products').getPublicUrl(filePath);
  return data.publicUrl;
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
