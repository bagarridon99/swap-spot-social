import { createClient } from "@supabase/supabase-js";

// Estos valores deben venir de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tusupabase.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJxyz...";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
