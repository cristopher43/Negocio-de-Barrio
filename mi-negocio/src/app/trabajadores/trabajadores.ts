import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import { obtenerSesion } from '../sesion';

type Trabajador = { id: string; nombre: string; correo: string; activo: boolean };

@Component({
  selector: 'app-trabajadores',
  imports: [FormsModule, RouterLink],
  templateUrl: './trabajadores.html',
  styleUrl: './trabajadores.css',
})
export class Trabajadores implements OnInit {
  trabajadores = signal<Trabajador[]>([]);
  mensaje = signal('');
  error = signal('');
  guardando = signal(false);

  nombre = '';
  correo = '';
  clave = '';
  aceptaPrivacidad = false;

  sesion: { idUsuario: string; idNegocio: string; rol: string } | null = null;

  async ngOnInit() {
    this.sesion = await obtenerSesion();
    if (!this.sesion || this.sesion.rol !== 'dueno') {
      this.error.set('Solo el dueño puede ver esta pantalla');
      return;
    }
    await this.cargar();
  }

  async cargar() {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, nombre, correo, activo')
      .eq('rol', 'trabajador')
      .order('nombre');

    if (error) {
      this.error.set('No pude cargar los trabajadores');
      return;
    }
    this.trabajadores.set(data ?? []);
  }

  async crear() {
    this.error.set('');
    this.mensaje.set('');
    this.guardando.set(true);

    const { data, error } = await supabase.functions.invoke('crear-trabajador', {
      body: {
        nombre: this.nombre,
        correo: this.correo,
        clave: this.clave,
        aceptaPrivacidad: this.aceptaPrivacidad,
      },
    });

    this.guardando.set(false);

    if (error) {
      // Cuando la función responde con error, el mensaje viene en la respuesta
      let texto = 'No pude crear el trabajador';
      try {
        const respuesta = (error as unknown as { context?: Response }).context;
        const json = await respuesta?.json();
        texto = json?.error ?? texto;
      } catch {
        // Si no se puede leer, se queda el mensaje por defecto
      }
      this.error.set(texto);
      return;
    }

    this.mensaje.set(`Listo: ${this.nombre} ya puede entrar con su correo y su clave.`);
    this.nombre = '';
    this.correo = '';
    this.clave = '';
    this.aceptaPrivacidad = false;
    await this.cargar();
  }
}