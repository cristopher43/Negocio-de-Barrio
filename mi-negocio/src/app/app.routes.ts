import { Route, Routes } from "@angular/router";
import { Menu } from "./menu/menu";
import { Venta } from "./venta/venta";

export const routes: Routes = [
    {path:'',component: Menu},
    {path:'vender',component: Venta},
    {path:'**',redirectTo: ''},
];
    