import { Component, OnInit } from "@angular/core";
import { TomarPedidoPage } from "../tomar-pedido/tomar-pedido.page";
import { ModalController } from "@ionic/angular";
import { TomarPedidoService } from "../servicios/tomar-pedido.service";
import { diccionario } from "../clases/diccionario";
import { Pedido } from "../clases/pedido";
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: "app-lista-pedidos-productos",
  templateUrl: "./lista-pedidos-productos.page.html",
  styleUrls: ["./lista-pedidos-productos.page.scss"]
})
export class ListaPedidosProductosPage implements OnInit {
  public pedidos: any;
  public filtro: string = "pendientes";
  public mostrarSpinner = false;
  usuario: any;
  constructor(
    public userServ: UsuariosService,
    public modalCtrl: ModalController,
    public tomarPedidoServ: TomarPedidoService
  ) {}

  ngOnInit() {
    this.usuario = this.userServ.getUsuarioStorage();
    this.mostrarPedidos();
  }

  async TomarPedido(pedidoInfo) {
    const modal = await this.modalCtrl.create({
      component: TomarPedidoPage,
      componentProps: { pedido: pedidoInfo }
    });
    modal.present();
    const pedido = await modal.onDidDismiss();

    if (pedido.data !== undefined) {
      if (this.usuario.puesto == "cocinero") {
        this.tomarPedidoServ
          .TomarPedidoCocinero(pedidoInfo.key, pedido.data.tiempoDeEspera)
          .then(() => {
            console.log("Regreso del TomarPedido");
          });
      } else if (this.usuario.puesto == "bartender") {
        this.tomarPedidoServ
          .TomarPedidoBartender(pedidoInfo.key, pedido.data.tiempoDeEspera)
          .then(() => {
            console.log("Regreso del TomarPedido");
          });
      }
    }
  }

  verificarPedidoListo(pedido: Pedido) {
    if (
      (pedido.estadoBartender == diccionario.estados_pedidos.listo &&
        pedido.estadoCocinero == diccionario.estados_pedidos.listo) ||
      (pedido.estadoBartender == diccionario.estados_pedidos.listo &&
        !this.tieneProductosDeTipo(pedido, "platos")) ||
      (pedido.estadoCocinero == diccionario.estados_pedidos.listo &&
        !this.tieneProductosDeTipo(pedido, "bebidas"))
    )
      this.tomarPedidoServ.PedidoListo(pedido.key);
  }

  tieneProductosDeTipo(pedido: Pedido, tipo) {
    return pedido.productoPedido.some(function(producto) {
      return producto.tipo == tipo;
    });
  }

  mostrarPedidos() {
    if (this.filtro == "pendientes") {
      this.tomarPedidoServ
        .TraerPedidos(ref =>
          ref.where("estado", "==", diccionario.estados_pedidos.aceptado)
        )
        .subscribe(pedidos => {
          this.pedidos = pedidos;
        });
    } else {
      this.tomarPedidoServ
        .TraerPedidos(ref =>
          ref
            .where(
              this.usuario.puesto == "cocinero"
                ? "estadoCocinero"
                : "estadoBartender",
              "==",
              diccionario.estados_pedidos.en_preparacion
            )
            .where(
              this.usuario.puesto == "cocinero"
                ? "responsableCocinero"
                : "responsableBartender",
              "==",
              this.usuario.id
            )
        )
        .subscribe(pedidos => {
          this.pedidos = pedidos;
        });
    }
  }

  correspondeAlPerfil(pedidoInfo: Pedido, perfil) {
    let estadoEsperado = this.filtro == "pendientes" ? null : "en preparación";
    return pedidoInfo.productoPedido.some(function(producto) {
      return (
        (producto.tipo == "cocina" &&
          perfil == "cocinero" &&
          pedidoInfo.estadoCocinero == estadoEsperado) ||
        (producto.tipo == "barra" &&
          perfil == "bartender" &&
          pedidoInfo.estadoBartender == estadoEsperado)
      );
    });
  }

  EntregarPedido(pedido: Pedido) {
    if (this.usuario.puesto == "cocinero") {
      this.tomarPedidoServ.EntregarPedidoCocinero(pedido.key).then(() => {
        console.log("Regreso del EntregarPedidoCocinero");
        pedido.estadoCocinero = diccionario.estados_pedidos.listo;
        this.verificarPedidoListo(pedido);
      });
    } else if (this.usuario.puesto == "bartender") {
      this.tomarPedidoServ.EntregarPedidoBartender(pedido.key).then(() => {
        console.log("Regreso del EntregarPedidoBartender");
        pedido.estadoBartender = diccionario.estados_pedidos.listo;
        this.verificarPedidoListo(pedido);
      });
    }
  }

  estadoValidoSegunPerfil(pedido, estadoEsperado) {
    if (this.usuario.puesto == "cocinero")
      return pedido.estadoCocinero == estadoEsperado;
    else if (this.usuario.puesto == "bartender")
      return pedido.estadoBartender == estadoEsperado;
  }
}
