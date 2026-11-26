import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import { formatoMiles } from '../formato';

type Producto = { id: string; nombre: string; marca: string; precio: number };
type ItemCarrito = { producto: Producto; cantidad: number };

@Component({
  selector: 'app-venta',
  imports: [RouterLink, FormsModule],
  templateUrl: './venta.html',
  styleUrl: './venta.css',
})
export class Venta implements OnInit {
  mensaje = signal('Cargando productos...');
  productos = signal<Producto[]>([]);
  carrito = signal<ItemCarrito[]>([]);
  busqueda = '';

  formato = formatoMiles;

  // El total se calcula solo a partir del carrito
  get total(): number {
    return this.carrito().reduce(
      (suma, item) => suma + item.producto.precio * item.cantidad,
      0
    );
  }

  get resultados() {
    const texto = this.busqueda.trim().toLowerCase();
    if (!texto) return [];

    return this.productos().filter((p) =>
      `${p.marca} ${p.nombre}`.toLowerCase().includes(texto)
    );
  }

  async ngOnInit() {
    const { data, error } = await supabase
      .from('producto')
      .select('id, nombre, precio, marca:marca(nombre)')
      .eq('estado_precio', 'activo');

    if (error) {
      this.mensaje.set('No pude cargar los productos');
      return;
    }

    this.productos.set(
      (data ?? []).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        marca: (p.marca as unknown as { nombre: string } | null)?.nombre ?? '',
        precio: Number(p.precio),
      }))
    );
    this.mensaje.set('Busca un producto para agregarlo');
  }

  escanear() {
    this.mensaje.set('Cámara lista para escanear');
  }

  // CREAR: agrega el producto, o le suma 1 si ya está en el carrito
  agregar(producto: Producto) {
    const existente = this.carrito().find((i) => i.producto.id === producto.id);

    if (existente) {
      this.cambiarCantidad(existente, 1);
    } else {
      this.carrito.set([...this.carrito(), { producto, cantidad: 1 }]);
    }
    this.busqueda = '';
  }

  // ACTUALIZAR: sube o baja la cantidad
  cambiarCantidad(item: ItemCarrito, cambio: number) {
    const nueva = item.cantidad + cambio;
    if (nueva <= 0) {
      this.quitar(item);
      return;
    }

    this.carrito.set(
      this.carrito().map((i) =>
        i.producto.id === item.producto.id ? { ...i, cantidad: nueva } : i
      )
    );
  }

  // BORRAR: saca el producto del carrito
  quitar(item: ItemCarrito) {
    this.carrito.set(
      this.carrito().filter((i) => i.producto.id !== item.producto.id)
    );
  }
}