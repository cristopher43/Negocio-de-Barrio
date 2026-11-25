import { Routes } from '@angular/router';
import { Menu } from './menu/menu';
import { Venta } from './venta/venta';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Menu },
  { path: 'vender', component: Venta },
  { path: '**', redirectTo: 'login' },
];