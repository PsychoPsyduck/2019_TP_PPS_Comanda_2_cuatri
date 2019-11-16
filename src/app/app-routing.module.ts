import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'splash', loadChildren: './splash/splash.module#SplashPageModule' },
  { path: 'abm-dueno', loadChildren: './abm-dueno/abm-dueno.module#AbmDuenoPageModule' },
  { path: 'registro-cliente', loadChildren: './registro-cliente/registro-cliente.module#RegistroClientePageModule' },
  { path: 'alta-prod', loadChildren: './alta-prod/alta-prod.module#AltaProdPageModule' },  { path: 'alta-pedido', loadChildren: './alta-pedido/alta-pedido.module#AltaPedidoPageModule' },
  { path: 'estado-pedido', loadChildren: './estado-pedido/estado-pedido.module#EstadoPedidoPageModule' },
  { path: 'principal-cliente', loadChildren: './principal-cliente/principal-cliente.module#PrincipalClientePageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
