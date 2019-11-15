import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReservasPendientesPage } from './reservas-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: ReservasPendientesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReservasPendientesPage]
})
export class ReservasPendientesPageModule {}
