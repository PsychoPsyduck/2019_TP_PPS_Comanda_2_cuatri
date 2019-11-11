import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ReservarMesaPage } from './reservar-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ReservarMesaPage
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
  declarations: [ReservarMesaPage]
})
export class ReservarMesaPageModule {}
