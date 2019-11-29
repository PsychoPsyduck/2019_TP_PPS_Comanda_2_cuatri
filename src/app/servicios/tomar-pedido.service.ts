import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { map } from "rxjs/operators";
import { Pedido } from '../clases/pedido'
import { AuthService } from "../servicios/auth.service";
import { QueryFn } from "@angular/fire/firestore";
import { diccionario } from '../clases/diccionario';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: "root"
})
export class TomarPedidoService {
  
  usuario: any;
  constructor(
    public userServ: UsuariosService,
    public firebase: FirebaseService,
    public authServ: AuthService
  ) {
    this.usuario = this.userServ.getUsuarioStorage()
  }

  TraerPedidos(query: QueryFn = null) {
    return this.firebase.traerColeccion("/pedidos", query).pipe(
      map(accion => {
        return accion.map(snap => {
          let data = snap.payload.doc.data() as Pedido;
          data.key = snap.payload.doc.id;
          return data;
        });
      })
    );
  }

  TomarPedidoCocinero(pedidoDoc, tiempoDeEspera) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      responsableCocinero: this.usuario.id,
      tiempoDeEsperaCocinero: tiempoDeEspera,
      estado: diccionario.estados_pedidos.en_preparacion,
      estadoCocinero: diccionario.estados_pedidos.en_preparacion
    });
  }

  TomarPedidoBartender(pedidoDoc, tiempoDeEspera) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      responsableBartender: this.usuario.id,
      tiempoDeEsperaBartender: tiempoDeEspera,
      estado: diccionario.estados_pedidos.en_preparacion,
      estadoBartender: diccionario.estados_pedidos.en_preparacion
    });
  }

  SetearPedido(pedidoDoc, pedido) {
    return this.firebase.setear("/pedidos", pedidoDoc, pedido);
  }

  EntregarPedidoCocinero(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estadoCocinero: diccionario.estados_pedidos.listo
    });
  }

  EntregarPedidoBartender(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estadoBartender: diccionario.estados_pedidos.listo
    });
  }

  EntregarPedidoMozo(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estado: diccionario.estados_pedidos.entregado_mozo
    });
  }

  AceptarPedido(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estado: diccionario.estados_pedidos.aceptado
    });
  }

  // ConfirmarPago(pedidoDoc) {
  //   return this.firebase.actualizar("/pedidos", pedidoDoc, {
  //     estado: diccionario.estados_pedidos.pagado
  //   });
  // }

  CerrarPedido(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estado: diccionario.estados_pedidos.cerrado
    });
  }

  PedidoListo(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estado: diccionario.estados_pedidos.listo
    });
  }

  TraerPedido(pedidoDoc){
    return this.firebase.TraerUnoPath('pedidos', pedidoDoc)
 }
}
