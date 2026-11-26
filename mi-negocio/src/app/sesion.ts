import { supabase } from './supabase';

export async function obtenerSesion() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('usuario')
    .select('id_negocio, rol')
    .eq('id', user.id)
    .single();

  return data
    ? { idUsuario: user.id, idNegocio: data.id_negocio as string, rol: data.rol as string }
    : null;
}