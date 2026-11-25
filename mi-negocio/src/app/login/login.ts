import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabase';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  correo = '';
  clave = '';
  error = '';

  constructor(private router: Router) {}

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

    this.router.navigateByUrl('/');
  }
}