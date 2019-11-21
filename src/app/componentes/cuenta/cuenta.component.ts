import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from '../../clases/pedido';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
})
export class CuentaComponent implements OnInit {

  @Input() pedido:Pedido;

  constructor() {
    console.log(this.pedido);
   }

  ngOnInit() {}

}
