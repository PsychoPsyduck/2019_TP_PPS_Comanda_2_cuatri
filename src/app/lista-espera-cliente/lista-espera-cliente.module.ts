import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaEsperaClientePage } from './lista-espera-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ListaEsperaClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaEsperaClientePage]
})
export class ListaEsperaClientePageModule {}
