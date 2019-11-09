import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaEsperaMesaPage } from './lista-espera-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ListaEsperaMesaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaEsperaMesaPage]
})
export class ListaEsperaMesaPageModule {}
