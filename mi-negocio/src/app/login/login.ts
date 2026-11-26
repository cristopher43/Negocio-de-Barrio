import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  correo = '';
  clave = '';
  error = '';

  constructor(private router: Router) {}

  // Se ejecuta al abrir la pantalla: si ya hay sesión guardada, entra directo
  async ngOnInit() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      this.router.navigateByUrl('/menu');
    }
  }

  async entrar() {
    this.error = '';
    const { error } = await supabase.auth.signInWithPassword({
      email: this.correo,
      password: this.clave,
    });

    if (error) {
      this.error = error.message;
      return;
    }

    this.router.navigateByUrl('/menu');
  }
}