import { Injectable } from '@angular/core';
import { Pedido } from '../clases/pedido';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(public firebase: FirebaseService) { }
  
  AgregarPedido(pedido: Pedido){
    return this.firebase.crear('pedidos', pedido);
  }
}
