import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { map } from "rxjs/operators";
import { Pedido } from '../clases/pedido'
import { AuthService } from "../servicios/auth.service";
import { QueryFn } from "@angular/fire/firestore";
import { diccionario } from '../clases/diccionario';

@Injectable({
  providedIn: "root"
})
export class TomarPedidoService {
  constructor(
    public firebase: FirebaseService,
    public authServ: AuthService
  ) {}

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
      responsableCocinero: this.authServ.obtenerUID(),
      tiempoDeEsperaCocinero: tiempoDeEspera,
      estado: diccionario.estados_pedidos.en_preparacion,
      estadoCocinero: diccionario.estados_pedidos.en_preparacion
    });
  }

  TomarPedidoBartender(pedidoDoc, tiempoDeEspera) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      responsableBartender: this.authServ.obtenerUID(),
      tiempoDeEsperaBartender: tiempoDeEspera,
      estado: diccionario.estados_pedidos.en_preparacion,
      estadoBartender: diccionario.estados_pedidos.en_preparacion
    });
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

  CerrarPedido(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estado: diccionario.estados_pedidos.pagado
    });
  }

  PedidoListo(pedidoDoc) {
    return this.firebase.actualizar("/pedidos", pedidoDoc, {
      estado: diccionario.estados_pedidos.listo
    });
  }
}
