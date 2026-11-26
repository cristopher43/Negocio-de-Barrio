import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../supabase';
import { obtenerSesion } from '../sesion';

type Marca = { id: string; nombre: string };

@Component({
  selector: 'app-producto-nuevo',
  imports: [FormsModule, RouterLink],
  templateUrl: './producto-nuevo.html',
  styleUrl: './producto-nuevo.css',
})
export class ProductoNuevo implements OnInit {
  marcas = signal<Marca[]>([]);
  mensaje = signal('');
  error = signal('');

  sesion: { idUsuario: string; idNegocio: string } | null = null;

  marcaId = '';
  marcaNueva = '';
  nombre = '';
  cantidad: number | null = null;

  async ngOnInit() {
    this.sesion = await obtenerSesion();
    if (!this.sesion) {
      this.error.set('No encontré tu negocio. Vuelve a entrar.');
      return;
    }

    const { data, error } = await supabase
      .from('marca')
      .select('id, nombre')
      .order('nombre');

    if (error) {
      this.error.set('No pude cargar las marcas');
      return;
    }
    this.marcas.set(data ?? []);
  }

  async guardar() {
    this.error.set('');
    this.mensaje.set('');

    if (!this.sesion) return;
    if (!this.nombre.trim()) {
      this.error.set('Escribe el nombre del producto');
      return;
    }
    if (!this.cantidad || this.cantidad <= 0) {
      this.error.set('Escribe cuántas unidades llegaron');
      return;
    }

    const { idNegocio, idUsuario } = this.sesion;

    // 1. Si la marca es nueva, se crea como pendiente
    let idMarca: string | null = null;
    if (this.marcaId === 'nueva') {
      const nombreMarca = this.marcaNueva.trim();
      if (!nombreMarca) {
        this.error.set('Escribe el nombre de la marca nueva');
        return;
      }
      const { data, error } = await supabase
        .from('marca')
        .insert({ id_negocio: idNegocio, nombre: nombreMarca, estado: 'pendiente' })
        .select('id')
        .single();

      if (error) {
        this.error.set('No pude crear la marca: ' + error.message);
        return;
      }
      idMarca = data.id;
    } else if (this.marcaId) {
      idMarca = this.marcaId;
    }

    // 2. Se crea el producto como pendiente de precio
    const { data: producto, error: errorProducto } = await supabase
      .from('producto')
      .insert({
        id_negocio: idNegocio,
        id_marca: idMarca,
        nombre: this.nombre.trim(),
        tipo_venta: 'unidad',
        estado_precio: 'pendiente',
        control_stock: true,
        stock: this.cantidad,
      })
      .select('id')
      .single();

    if (errorProducto) {
      this.error.set('No pude guardar el producto: ' + errorProducto.message);
      return;
    }

    // 3. Se registra la entrada de stock
    await supabase.from('movimiento_stock').insert({
      id_producto: producto.id,
      id_usuario: idUsuario,
      tipo: 'entrada',
      cantidad: this.cantidad,
      motivo: 'Llegada de mercadería',
    });

    this.mensaje.set('Listo. Quedó esperando precio.');
    this.nombre = '';
    this.cantidad = null;
    this.marcaId = '';
    this.marcaNueva = '';
  }
}