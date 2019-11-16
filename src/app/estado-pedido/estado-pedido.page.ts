import { Component, OnInit } from '@angular/core';
import { Pedido } from '../clases/pedido';
import { ProductoPedido } from '../clases/producto-pedido';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva } from '../clases/reserva';
import { diccionario } from '../clases/diccionario';
import { Mesa } from '../clases/mesa';
import { AuthService } from '../servicios/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessageHandlerService } from '../servicios/message-handler.service';
import { FirebaseService } from '../servicios/firebase.service';
import { SpinnerService } from '../servicios/spinner.service';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.page.html',
  styleUrls: ['./estado-pedido.page.scss'],
})
export class EstadoPedidoPage implements OnInit {

  public mesa: string;

  public pedido: Pedido;
  public mostrar: boolean;
  public mostrarDetallePedido: boolean;
  public cuenta: boolean;
  public confirmarEntrega: boolean;

  public hacerPedido: boolean;
  public reservaKey: string;
  public cerrar: boolean;
  public subReserva: any;
  public subsPedido: any;
  // public mostrarSpinner = false;
  public productosPedidos: Array<ProductoPedido>;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authServ: AuthService,
    public db: AngularFirestore,
    public messageHandlerServ: MessageHandlerService,
    public firebaseServ: FirebaseService,
    public spinnerServ: SpinnerService) { }

  public traerMesaReservas(valor: string) {
    return this.db.collection('reservas').snapshotChanges().pipe(map((reservas) => {
      const auxReserva: any = reservas.map((a) => {
        const data: any = a.payload.doc.data();
        data.key = a.payload.doc.id;
        return data;
      });

      const auxRetorno: Array<any> = new Array<any>();
      for (const reservaA of auxReserva) {
        if ((reservaA as Reserva).idMesa === valor) {
          auxRetorno.push(reservaA);
          // console.log('Añadido a la lista proveniente de la base de datos para las reservas');
        }
      }
      return auxRetorno;
    }));
  }

  public traerIdMesa(idMesa: string) {
    return this.db.collection('mesas').snapshotChanges().pipe(map((mesas) => {
      const auxMesas: any = mesas.map((a) => {
        const data: any = a.payload.doc.data();
        data.key = a.payload.doc.id;
        return data;
      });

      const auxRetorno: Array<any> = new Array<any>();
      for (const mesaA of auxMesas) {
        if ((mesaA as Mesa).id === idMesa) {
          auxRetorno.push(mesaA);
          // console.log('Añadido a la lista proveniente de la base de datos para las reservas');
        }
      }

      return auxRetorno;
    }));
  }

  public traerIdPedido(keyPedido: string) {
    return this.db.collection('pedidos').snapshotChanges().pipe(map((pedidos) => {
      const auxPedidos: any = pedidos.map((a) => {
        const data: any = a.payload.doc.data();
        data.key = a.payload.doc.id;
        return data;
      });

      const auxRetorno: Array<any> = new Array<any>();
      for (const pedidoA of auxPedidos) {
        if ((pedidoA.key as string) === keyPedido) {
          auxRetorno.push(pedidoA);
          // console.log('Añadido a la lista proveniente de la base de datos para los Pedidos');
        }
      }

      return auxRetorno;
    }));
  }

  ngOnInit() {
    this.mesa = this.route.snapshot.paramMap.get('mesa');
    this.cuenta = false;
    this.hacerPedido = false;
    this.cerrar = false;
    this.confirmarEntrega = false;

    this.pedido = new Pedido();
    this.pedido.key = '-1';
    this.mostrar = false;
    // this.mostrarSpinner = true;
    this.spinnerServ.showLoadingSpinner();

    console.log('Comienzo a buscar');
    this.subReserva = this.traerMesaReservas(this.mesa)
      .subscribe(snapshots => {
        let auxSnaps: Array<Reserva> = snapshots;
        console.log(auxSnaps);

        if (this.authServ.user.perfil === 'cliente' || this.authServ.user.perfil === 'anonimo') {
          auxSnaps = auxSnaps.filter((a: Reserva) => a.cliente === this.authServ.obtenerUID());
        }

        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < auxSnaps.length; index++) {
          console.log('Estoy en el for de las reservas de las mesas');

          // Tengo la mesa con pedido => busco el pedido
          if ((auxSnaps[index].idMesa as string) === this.mesa &&
            auxSnaps[index].estado === diccionario.estados_reservas.en_curso) {
            this.pedido.key = auxSnaps[index].idPedido;
            this.reservaKey = auxSnaps[index].key;

            console.log('Busco la mesa');
            this.subsPedido = this.traerIdPedido(this.pedido.key)
              .subscribe(snp => {
                const auxSnapsPedido = snp;
                console.log(auxSnapsPedido);

                this.pedido.estado = auxSnapsPedido[0].estado;
                this.mostrar = true;

                if (this.pedido.estado === diccionario.estados_pedidos.en_preparacion
                  || this.pedido.estado === diccionario.estados_pedidos.listo ||
                  this.pedido.estado === diccionario.estados_pedidos.aceptado) {
                  this.productosPedidos = auxSnapsPedido[0].productoPedido;
                  // console.log(this.productosPedidos);
                  this.mostrarDetallePedido = true;
                } else {
                  this.productosPedidos = [];
                  this.mostrarDetallePedido = false;
                }

                if (this.pedido.estado === diccionario.estados_pedidos.entregado_mozo && this.authServ.user.perfil === 'cliente') {
                  this.confirmarEntrega = true;
                } else if (this.pedido.estado === diccionario.estados_pedidos.confirmado && this.authServ.user.perfil === 'cliente') {
                  this.cuenta = true;
                } else if (this.pedido.estado === diccionario.estados_pedidos.pagado && this.authServ.user.perfil === 'mozo') {
                  this.cerrar = true;
                }

                // this.mostrarSpinner = false;
                this.spinnerServ.hideLoadingSpinner();
              });
            break;
          } else if (auxSnaps[index].idMesa === this.mesa && auxSnaps[index].estado === diccionario.estados_reservas.en_curso) {
            this.reservaKey = auxSnaps[index].key;
          }
        }

        // Si no tengo pedido es porque la mesa está libre o deshabilitada o porque aun no hice pedido
        if (this.pedido.key === '-1' && this.authServ.user.perfil === 'mozo') {
          // this.mostrarSpinner = false;
          this.spinnerServ.hideLoadingSpinner();
          this.messageHandlerServ.mostrarErrorLiteral(diccionario.errores.sin_pedido);
          this.hacerPedido = true;
        } else if (this.pedido.key === '-1' && this.authServ.user.perfil === 'cliente') {
          // this.mostrarSpinner = false;
          this.spinnerServ.hideLoadingSpinner();
          this.messageHandlerServ.mostrarErrorLiteral(diccionario.errores.sin_pedido);
          this.router.navigate(['principal-cliente']);
        }
      });
  }

  public irA(donde: string) {
    switch (donde) {
      /* case 'cerrar': {
        this.messageHandlerServ.mostrarMensaje('Voy a la página principal del mozo');
        this.router.navigate(['pricnipal-mozo']);
        break;
      }
      case 'hacerPedido':
        this.messageHandlerServ.mostrarMensaje('Voy al alta de pedido con la reserva');
        // this.router.navigate(['alta-pedido', { reserva: this.reservaKey, clienteUid: this.clienteUid, mesa: this.mesa }]);
        break; */
      case 'solicitarCuenta': {
        this.messageHandlerServ.mostrarMensaje('El mozo le traerá la cuenta.');
        break;
      }
    }
  }

  public cerrarMesa() {
    // this.mostrarSpinner = true;
    this.spinnerServ.showLoadingSpinner();
    this.subsPedido.unsubscribe();
    // Traigo y actualizo los datos de la mesa

    this.traerIdMesa(this.mesa)
      .subscribe(snapshots => {
        const auxMesas: Array<Mesa> = snapshots;
        auxMesas[0].estado = diccionario.estados_mesas.libre;

        this.firebaseServ.actualizar('mesas', auxMesas[0].key, auxMesas[0])
          .then(() => {
            // Traigo y finalizo la reseva
            this.db.collection('reservas').doc(this.reservaKey).valueChanges()
              .subscribe((snapshotsReservas) => {
                const auxReserva = snapshotsReservas;
                auxReserva[0].estado = diccionario.estados_reservas.finalizada;
                this.firebaseServ.actualizar('reservas', this.reservaKey, auxReserva[0]).then(() => {
                  // this.mostrarSpinner = false;
                  this.spinnerServ.hideLoadingSpinner();
                  this.irA('cerrar');
                });
              });
          });
      });
  }

  public confirmarEntregaPedido() {
    // this.mostrarSpinner = false;
    this.spinnerServ.showLoadingSpinner();
    this.firebaseServ.actualizar('pedidos', this.pedido.key, { estado: diccionario.estados_pedidos.confirmado }).then(() => {
      console.log('Se confirma la entrega del pedido.');
      this.confirmarEntrega = false;
      // this.mostrarSpinner = false;
      this.spinnerServ.hideLoadingSpinner();
    }).catch((err) => {
      this.messageHandlerServ.mostrarError(err);
      // this.mostrarSpinner = false;
      this.spinnerServ.hideLoadingSpinner();
    });
  }

}
