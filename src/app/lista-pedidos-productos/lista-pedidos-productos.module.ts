import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaPedidosProductosPage } from './lista-pedidos-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPedidosProductosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaPedidosProductosPage]
})
export class ListaPedidosProductosPageModule {}
