import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { supabase } from '../supabase';
import { obtenerSesion, Sesion } from '../sesion';
import { UsuarioAvatarComponent } from '../usuario-avatar.component';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, UsuarioAvatarComponent],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  sesion: Sesion | null = null;

  constructor(private router: Router) {}

  // Al abrir el menú, carga quién está usando la app
  async ngOnInit() {
    this.sesion = await obtenerSesion();
  }

  // Cierra la sesión guardada y vuelve al login
  async salir() {
    await supabase.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}
