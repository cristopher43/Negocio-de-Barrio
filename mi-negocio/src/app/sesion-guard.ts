import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from './supabase';

// Deja pasar solo si hay una sesión iniciada; si no, manda al login
export const requiereSesion: CanActivateFn = async () => {
  const router = inject(Router);
  const { data } = await supabase.auth.getSession();
  return data.session ? true : router.createUrlTree(['/login']);
};