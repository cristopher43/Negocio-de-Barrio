import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  constructor(private router: Router) {}

  // Cierra la sesión guardada y vuelve al login
  async salir() {
    await supabase.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}