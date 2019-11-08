import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'splash', loadChildren: './splash/splash.module#SplashPageModule' },
  { path: 'abm-dueno', loadChildren: './abm-dueno/abm-dueno.module#AbmDuenoPageModule' },
  { path: 'registro-cliente', loadChildren: './registro-cliente/registro-cliente.module#RegistroClientePageModule' },
  //{ path: 'alta-prod', loadChildren: './alta-prod/alta-prod.module#AltaProdPageModule' },
  { path: 'lista-usuarios-pendientes', loadChildren: './lista-usuarios-pendientes/lista-usuarios-pendientes.module#ListaUsuariosPendientesPageModule' },
  { path: 'abm-empleado', loadChildren: './abm-empleado/abm-empleado.module#AbmEmpleadoPageModule' },
  { path: 'abm-mesa', loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule' },
  { path: 'tomar-pedido', loadChildren: './tomar-pedido/tomar-pedido.module#TomarPedidoPageModule' },
  { path: 'lista-pedidos', loadChildren: './lista-pedidos/lista-pedidos.module#ListaPedidosPageModule' },
  { path: 'lista-pedidos-productos', loadChildren: './lista-pedidos-productos/lista-pedidos-productos.module#ListaPedidosProductosPageModule' },  { path: 'alta-pedido', loadChildren: './alta-pedido/alta-pedido.module#AltaPedidoPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
