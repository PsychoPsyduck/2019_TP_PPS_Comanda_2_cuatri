import { Component, OnInit } from "@angular/core";
import { TomarPedidoPage } from "../tomar-pedido/tomar-pedido.page";
import { ModalController } from "@ionic/angular";
import { TomarPedidoService } from "../servicios/tomar-pedido.service";
import { diccionario } from "../clases/diccionario";
import { Pedido } from "../clases/pedido";
import { UsuariosService } from '../servicios/usuarios.service';
import { MesasService } from '../servicios/mesas.service';

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
    public tomarPedidoServ: TomarPedidoService,
    private mesasServ: MesasService
  ) { }

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
      var d = new Date();
      d.setMinutes(d.getMinutes() + pedido.data.tiempoDeEspera);
      var tiempoDeEspera = d.getHours() + ":" + d.getMinutes();

      if (this.usuario.puesto == "cocinero") {
        this.tomarPedidoServ
          .TomarPedidoCocinero(pedidoInfo.key, tiempoDeEspera)
          .then(() => {
            console.log("Regreso del TomarPedido");

            this.tomarPedidoServ.TraerPedido(pedidoInfo.key).subscribe(pedido => {
              var data = pedido.data();
              var horaDeEntrega = "";

              if (data.tiempoDeEsperaBartender == undefined) {
                horaDeEntrega = data.tiempoDeEsperaCocinero;
              }
              else {
                horaDeEntrega = data.tiempoDeEsperaCocinero > data.tiempoDeEsperaBartender ? data.tiempoDeEsperaCocinero : data.tiempoDeEsperaBartender;
              }

              data.horaDeEntrega = horaDeEntrega;
              this.tomarPedidoServ.SetearPedido(pedidoInfo.key, data);
            });
          });
      } else if (this.usuario.puesto == "bartender") {
        this.tomarPedidoServ
          .TomarPedidoBartender(pedidoInfo.key, tiempoDeEspera)
          .then(() => {
            console.log("Regreso del TomarPedido");

            this.tomarPedidoServ.TraerPedido(pedidoInfo.key).subscribe(pedido => {
              var data = pedido.data();
              var horaDeEntrega = "";

              if (data.tiempoDeEsperaCocinero == undefined) {
                horaDeEntrega = data.tiempoDeEsperaBartender;
              }
              else {
                horaDeEntrega = data.tiempoDeEsperaCocinero > data.tiempoDeEsperaBartender ? data.tiempoDeEsperaCocinero : data.tiempoDeEsperaBartender;
              }

              data.horaDeEntrega = horaDeEntrega;
              this.tomarPedidoServ.SetearPedido(pedidoInfo.key, data);
            });
          });
      }
    }
  }

  verificarPedidoListo(pedidoparam: Pedido) {
    this.tomarPedidoServ.TraerPedido(pedidoparam.key).subscribe(data => {
      var pedido = data.data();
      if (
        (pedido.estadoBartender == diccionario.estados_pedidos.listo &&
          pedido.estadoCocinero == diccionario.estados_pedidos.listo) ||
        (pedido.estadoBartender == diccionario.estados_pedidos.listo &&
          !this.tieneProductosDeTipo(pedido, "cocina")) ||
        (pedido.estadoCocinero == diccionario.estados_pedidos.listo &&
          !this.tieneProductosDeTipo(pedido, "barra"))
      ) {
        this.tomarPedidoServ.PedidoListo(pedidoparam.key);
      }
    })
  }

  tieneProductosDeTipo(pedido, tipo) {
    return pedido.productoPedido.some(function (producto) {
      return producto.tipo == tipo;
    });
  }

  mostrarPedidos() {
    if (this.filtro == "pendientes") {
      this.tomarPedidoServ
        .TraerPedidos()
        .subscribe(pedidos => {
          this.procesarPedidos(pedidos)
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
          this.procesarPedidos(pedidos)
        });
    }
  }

  procesarPedidos(pedidos) {
    var usuario = this.usuario;
    
    if (pedidos.length == 0)
      this.pedidos = pedidos;
    else {
      pedidos.map(pedido => {
        if (this.filtro == "pendientes")
          return pedido.estado == diccionario.estados_pedidos.aceptado || pedido.estado == diccionario.estados_pedidos.en_preparacion
      })
      pedidos.map(pedido => {
        pedido.productoPedido = pedido.productoPedido.filter(function (producto) {
          if (usuario.puesto == 'cocinero')
            return producto.tipo == 'cocina';
          else if (usuario.puesto == 'bartender')
            return producto.tipo == 'barra';
        })

        this.mesasServ.TraerMesa(pedido.mesa).then(mesa => {
          pedido.numeroMesa = mesa.numero;
          this.pedidos = pedidos;
        })
      })
    }
  }

  correspondeAlPerfil(pedidoInfo: Pedido, perfil) {
    let estadoEsperado = this.filtro == "pendientes" ? null : "en preparación";
    return pedidoInfo.productoPedido.some(function (producto) {
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

  cambiaTipoPedido(event) {
    this.filtro = event.detail.value;
    this.mostrarPedidos();
  }
}
