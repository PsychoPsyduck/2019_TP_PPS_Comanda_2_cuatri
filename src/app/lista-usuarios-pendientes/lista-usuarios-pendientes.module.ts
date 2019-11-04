import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaUsuariosPendientesPage } from './lista-usuarios-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListaUsuariosPendientesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaUsuariosPendientesPage]
})
export class ListaUsuariosPendientesPageModule {}
