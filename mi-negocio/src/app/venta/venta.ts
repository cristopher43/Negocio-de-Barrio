import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-venta',
  imports: [RouterLink],
  templateUrl: './venta.html',
  styleUrl: './venta.css',
})
export class Venta {
  mensaje = 'Escanea un producto o búscalo por nombre';
  total = 0;

  productos = [
    { id: 1, nombre: 'Coca-Cola 1.5 L', precio: 1500 },
    { id: 2, nombre: 'Pan amasado', precio: 800 },
    { id: 3, nombre: 'Jamón de pierna', precio: 3250 },
  ];

  seleccionado: string | null = null;

  escanear() {
    this.mensaje = 'Cámara lista para escanear';
  }

  buscar() {
    this.mensaje = 'Escribe el nombre del producto';
  }

  sumar() {
    this.total += 1000;
  }

  elegir(producto: { id: number; nombre: string; precio: number }) {
    this.seleccionado = producto.nombre;
    this .total += producto.precio;
  }
}