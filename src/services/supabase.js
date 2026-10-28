import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Normalizar la URL en caso de que incluya /rest/v1 o trailing slash
export const cleanSupabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    cleanSupabaseUrl &&
    supabaseAnonKey &&
    cleanSupabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 15
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(cleanSupabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Comprueba si la conexión con Supabase es funcional
 */
export async function testSupabaseConnection() {
  if (!supabase) return { connected: false, message: 'Supabase no está configurado.' };
  try {
    const { data, error } = await supabase.from('learning_areas').select('id').limit(1);
    if (error) {
      return {
        connected: true,
        tablesReady: false,
        error: error.message,
        message: 'Conectado a Supabase, pero las tablas aún no han sido creadas. Ejecuta la migración SQL en el SQL Editor de Supabase.'
      };
    }
    return {
      connected: true,
      tablesReady: true,
      count: data?.length || 0,
      message: 'Conexión exitosa y tablas listas en Supabase.'
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      message: 'Error de red o conexión al intentar comunicar con Supabase.'
    };
  }
}
