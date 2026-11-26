import { Routes } from '@angular/router';
import { Menu } from './menu/menu';
import { Venta } from './venta/venta';
import { Login } from './login/login';
import { Privacidad } from './privacidad/privacidad';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Menu },
  { path: 'vender', component: Venta },
    { path: 'privacidad', component: Privacidad },
  { path: '**', redirectTo: 'login' },
];