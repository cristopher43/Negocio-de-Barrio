import { Routes } from '@angular/router';
import { Menu } from './menu/menu';
import { Venta } from './venta/venta';
import { Login } from './login/login';
import { Privacidad } from './privacidad/privacidad';
import { ProductoNuevo } from './producto-nuevo/producto-nuevo';
import { Pendientes } from './pendientes/pendientes';
import { Precios } from './precios/precios';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'menu', component: Menu },
  { path: 'vender', component: Venta },
  { path: 'privacidad', component: Privacidad },
  { path: 'producto-nuevo', component: ProductoNuevo },
  { path: 'pendientes', component: Pendientes },
  { path: 'precios', component: Precios },
  { path: '**', redirectTo: 'login' },
];