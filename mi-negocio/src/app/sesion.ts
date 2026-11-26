import { supabase } from './supabase';

export type Sesion = {
  idUsuario: string;
  idNegocio: string;
  rol: string;
  nombre: string;
  correo: string;
};

// Devuelve quién está usando la app: nombre, correo, rol y negocio
export async function obtenerSesion(): Promise<Sesion | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('usuario')
    .select('id_negocio, rol, nombre, correo')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;

  return {
    idUsuario: user.id,
    idNegocio: data.id_negocio,
    rol: data.rol,
    nombre: data.nombre,
    correo: data.correo,
  };
}
