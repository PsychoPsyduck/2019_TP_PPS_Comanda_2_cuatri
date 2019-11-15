import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IngresoAnonimoPage } from './ingreso-anonimo.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoAnonimoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IngresoAnonimoPage]
})
export class IngresoAnonimoPageModule {}
