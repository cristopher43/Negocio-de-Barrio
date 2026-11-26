import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import { obtenerSesion } from '../sesion';

type Item = { id: string; nombre: string; precioInput: number | null };

type Grupo = {
  marcaId: string | null;
  marcaNombre: string;
  marcaEstado: string;
  items: Item[];
};

@Component({
  selector: 'app-pendientes',
  imports: [FormsModule, RouterLink],
  templateUrl: './pendientes.html',
  styleUrl: './pendientes.css',
})
export class Pendientes implements OnInit {
  grupos = signal<Grupo[]>([]);
  mensaje = signal('');
  error = signal('');

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
      .from('producto')
      .select('id, nombre, marca:marca(id, nombre, estado)')
      .eq('estado_precio', 'pendiente')
      .order('nombre');

    if (error) {
      this.error.set('No pude cargar los pendientes');
      return;
    }

    // Agrupa los productos por marca
    const mapa = new Map<string, Grupo>();
    for (const p of data ?? []) {
      const marca = p.marca as unknown as { id: string; nombre: string; estado: string } | null;
      const clave = marca?.id ?? 'sin-marca';

      if (!mapa.has(clave)) {
        mapa.set(clave, {
          marcaId: marca?.id ?? null,
          marcaNombre: marca?.nombre ?? 'Sin marca',
          marcaEstado: marca?.estado ?? 'confirmada',
          items: [],
        });
      }
      mapa.get(clave)!.items.push({ id: p.id, nombre: p.nombre, precioInput: null });
    }

    this.grupos.set([...mapa.values()]);
  }

  async confirmarMarca(grupo: Grupo) {
    if (!grupo.marcaId) return;

    const { error } = await supabase
      .from('marca')
      .update({ estado: 'confirmada' })
      .eq('id', grupo.marcaId);

    if (error) {
      this.error.set('No pude confirmar la marca: ' + error.message);
      return;
    }
    this.error.set('');
    await this.cargar();
  }

  async guardarTodos() {
    if (!this.sesion) return;
    this.error.set('');
    this.mensaje.set('');

    let guardados = 0;

    for (const grupo of this.grupos()) {
      for (const item of grupo.items) {
        if (!item.precioInput || item.precioInput <= 0) continue;

        // 1. Pone el precio y activa el producto
        const { error: errorProducto } = await supabase
          .from('producto')
          .update({ precio: item.precioInput, estado_precio: 'activo' })
          .eq('id', item.id);

        if (errorProducto) {
          this.error.set('Error al guardar ' + item.nombre + ': ' + errorProducto.message);
          return;
        }

        // 2. Deja registro en el historial de precios
        const { error: errorHistorial } = await supabase.from('historial_precio').insert({
          id_producto: item.id,
          precio_anterior: null,
          precio_nuevo: item.precioInput,
          id_usuario: this.sesion.idUsuario,
        });

        if (errorHistorial) {
          this.error.set('Se guardó el precio pero no el historial: ' + errorHistorial.message);
          return;
        }
        guardados++;
      }
    }

    this.mensaje.set(
      guardados > 0 ? `Listo: ${guardados} producto(s) activados` : 'No escribiste ningún precio'
    );
    await this.cargar();
  }
}