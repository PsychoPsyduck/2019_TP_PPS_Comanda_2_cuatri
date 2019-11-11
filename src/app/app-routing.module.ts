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
  { path: 'lista-usuarios-pendientes', loadChildren: './lista-usuarios-pendientes/lista-usuarios-pendientes.module#ListaUsuariosPendientesPageModule' },
  { path: 'lista-espera-mesa', loadChildren: './lista-espera-mesa/lista-espera-mesa.module#ListaEsperaMesaPageModule' },
  { path: 'lista-espera-cliente', loadChildren: './lista-espera-cliente/lista-espera-cliente.module#ListaEsperaClientePageModule' },
  { path: 'alta-prod', loadChildren: './alta-prod/alta-prod.module#AltaProdPageModule' },
  { path: 'abm-empleado', loadChildren: './abm-empleado/abm-empleado.module#AbmEmpleadoPageModule' },
  { path: 'abm-mesa', loadChildren: './abm-mesa/abm-mesa.module#AbmMesaPageModule' },  { path: 'reservar-mesa', loadChildren: './reservar-mesa/reservar-mesa.module#ReservarMesaPageModule' },
  { path: 'reservas-pendientes', loadChildren: './reservas-pendientes/reservas-pendientes.module#ReservasPendientesPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
