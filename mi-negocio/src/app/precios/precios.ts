import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import { obtenerSesion } from '../sesion';
import { formatoMiles, soloNumero } from '../formato';

type Producto = {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  nuevoPrecioTexto: string;
};

@Component({
  selector: 'app-precios',
  imports: [FormsModule, RouterLink],
  templateUrl: './precios.html',
  styleUrl: './precios.css',
})
export class Precios implements OnInit {
  productos = signal<Producto[]>([]);
  mensaje = signal('');
  error = signal('');

  sesion: { idUsuario: string; idNegocio: string; rol: string } | null = null;

  formato = formatoMiles;

  async ngOnInit() {
    this.sesion = await obtenerSesion();
    if (!this.sesion || this.sesion.rol !== 'dueno') {
      this.error.set('Solo el dueño puede cambiar precios');
      return;
    }
    await this.cargar();
  }

  async cargar() {
    // Guarda lo que el dueño ya escribió en otros productos
    const borradores = new Map(
      this.productos().map((p) => [p.id, p.nuevoPrecioTexto])
    );

    const { data, error } = await supabase
      .from('producto')
      .select('id, nombre, precio, marca:marca(nombre)')
      .eq('estado_precio', 'activo')
      .order('nombre');

    if (error) {
      this.error.set('No pude cargar los productos');
      return;
    }

    this.productos.set(
      (data ?? []).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        marca: (p.marca as unknown as { nombre: string } | null)?.nombre ?? '',
        precio: Number(p.precio),
        nuevoPrecioTexto: borradores.get(p.id) ?? '',
      }))
    );
  }

  alEscribir(p: Producto, evento: Event) {
    const texto = (evento.target as HTMLInputElement).value;
    p.nuevoPrecioTexto = formatoMiles(texto);
  }

  async cambiarPrecio(p: Producto) {
    this.error.set('');
    this.mensaje.set('');
    if (!this.sesion) return;

    const nuevoPrecio = soloNumero(p.nuevoPrecioTexto);

    if (nuevoPrecio <= 0) {
      this.error.set('Escribe el nuevo precio');
      return;
    }
    if (nuevoPrecio === p.precio) {
      this.error.set('Ese es el mismo precio que ya tiene');
      return;
    }

    const confirmado = confirm(
      `¿Seguro que quiere cambiar el precio de ${p.marca} ${p.nombre} de $${formatoMiles(p.precio)} a $${formatoMiles(nuevoPrecio)}?`
    );
    if (!confirmado) return;

    const { error: errorPrecio } = await supabase
      .from('producto')
      .update({ precio: nuevoPrecio })
      .eq('id', p.id);

    if (errorPrecio) {
      this.error.set('No pude cambiar el precio: ' + errorPrecio.message);
      return;
    }

    const { error: errorHistorial } = await supabase.from('historial_precio').insert({
      id_producto: p.id,
      precio_anterior: p.precio,
      precio_nuevo: nuevoPrecio,
      id_usuario: this.sesion.idUsuario,
    });

    if (errorHistorial) {
      this.error.set('Cambió el precio, pero no quedó en el historial: ' + errorHistorial.message);
      return;
    }

    // Limpia solo el campo del producto que se cambió
    p.nuevoPrecioTexto = '';

    this.mensaje.set(`Listo: ${p.nombre} ahora cuesta $${formatoMiles(nuevoPrecio)}`);
    await this.cargar();
  }
}