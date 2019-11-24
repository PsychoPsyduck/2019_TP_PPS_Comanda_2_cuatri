import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaClientePage } from './encuesta-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaClientePage
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
  declarations: [EncuestaClientePage]
})
export class EncuestaClientePageModule {}
