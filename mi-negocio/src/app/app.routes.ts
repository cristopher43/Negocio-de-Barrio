import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Menu } from './menu/menu';
import { Venta } from './venta/venta';
import { Privacidad } from './privacidad/privacidad';
import { ProductoNuevo } from './producto-nuevo/producto-nuevo';
import { Pendientes } from './pendientes/pendientes';
import { Precios } from './precios/precios';
import { Trabajadores } from './trabajadores/trabajadores';
import { requiereSesion } from './sesion-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'privacidad', component: Privacidad },
  { path: 'menu', component: Menu, canActivate: [requiereSesion] },
  { path: 'vender', component: Venta, canActivate: [requiereSesion] },
  { path: 'producto-nuevo', component: ProductoNuevo, canActivate: [requiereSesion] },
  { path: 'pendientes', component: Pendientes, canActivate: [requiereSesion] },
  { path: 'precios', component: Precios, canActivate: [requiereSesion] },
  { path: 'trabajadores', component: Trabajadores, canActivate: [requiereSesion] },
  { path: '**', redirectTo: 'login' },
];