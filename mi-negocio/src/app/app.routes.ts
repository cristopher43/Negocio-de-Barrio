import { Routes } from '@angular/router';
import { Menu } from './menu/menu';
import { Venta } from './venta/venta';
import { Login } from './login/login';
import { Privacidad } from './privacidad/privacidad';
import { ProductoNuevo } from './producto-nuevo/producto-nuevo';
import { Pendientes } from './pendientes/pendientes';




export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Menu },
  { path: 'vender', component: Venta },
  { path: 'privacidad', component: Privacidad },
  { path: 'producto-nuevo', component: ProductoNuevo },
  { path: 'pendientes', component: Pendientes },
  { path: '**', redirectTo: 'login' },
];