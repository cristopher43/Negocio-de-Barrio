import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';

type Producto = { id: string; nombre: string; precio: number };

@Component({
  selector: 'app-venta',
  imports: [RouterLink, FormsModule],
  templateUrl: './venta.html',
  styleUrl: './venta.css',
})
export class Venta implements OnInit {
  mensaje = signal('Cargando productos...');
  productos = signal<Producto[]>([]);
  total = 0;
  busqueda = '';
  seleccionado: string | null = null;

  get resultados() {
    const texto = this.busqueda.trim().toLowerCase();
    if (!texto) return [];

    return this.productos().filter((p) =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  async ngOnInit() {
    const { data, error } = await supabase
      .from('producto')
      .select('id, nombre, precio')
      .eq('estado_precio', 'activo');

    if (error) {
      this.mensaje.set('No pude cargar los productos');
      return;
    }

    this.productos.set(
      (data ?? []).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: Number(p.precio),
      }))
    );
    this.mensaje.set('Escanea un producto o búscalo por nombre');
  }

  escanear() {
    this.mensaje.set('Cámara lista para escanear');
  }

  elegir(producto: Producto) {
    this.seleccionado = producto.nombre;
    this.total += producto.precio;
  }
}