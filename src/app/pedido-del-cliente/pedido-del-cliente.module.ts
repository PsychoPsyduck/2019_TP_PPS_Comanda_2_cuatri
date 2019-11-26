import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidoDelClientePage } from './pedido-del-cliente.page';



const routes: Routes = [
  {
    path: '',
    component: PedidoDelClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),



 
  ],
  declarations: [PedidoDelClientePage],

})
export class PedidoDelClientePageModule {}
