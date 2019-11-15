import { Component, OnInit } from '@angular/core';
import { Reserva } from '../clases/Reserva';
import { AuthService } from '../servicios/auth.service';
import { BarcodeService } from '../servicios/barcode.service';
import { AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from '../servicios/firebase.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../servicios/spinner.service';
import { MesasService } from '../servicios/mesas.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { diccionario } from '../clases/diccionario';
import { Usuario } from '../clases/Usuario';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido.page';
import { ToastService } from '../servicios/toast.service';
import { PedidoService } from '../servicios/pedido.service';

@Component({
  selector: 'app-principal-cliente',
  templateUrl: './principal-cliente.page.html',
  styleUrls: ['./principal-cliente.page.scss'],
})
export class PrincipalClientePage implements OnInit {

  public usuario: Usuario;
  public nombreUsuario: string;
  public mesa: string;
  public idMesa: string;

  public puedeJugar = false;
  public puedeHacerPedido = false;
  public puedeVerPedido = false;
  public puedeHacerDelivery = true;
  public puedeSolicitarMesa = true;
  public esperandoAsignacion = false;
  public auxPedido: any = undefined;
  public auxReserva: Reserva = undefined;
  public flagEstaActivo = true;
  // public mostrarSpinner = false;

  public userDelivery: any;
  public userListaEspera: any;
  public listaEsperaUser: any;
  public userReservas: any;
  public watchPedido: any;

  constructor(
    public authServ: AuthService,
    public usuarioServ: UsuariosService,
    public barcodeServ: BarcodeService,
    public alertCtrl: AlertController,
    public firebaseServ: FirebaseService,
    public router: Router,
    public toastServ: ToastService,
    // public notificationPushServ: NotificationPushService,
    public db: AngularFirestore,
    // public parserServ: ParserTypesService,
    // public messageHandlerServ: MessageHandlerService,
    public modalCtrl: ModalController,
    // public pedidoServ: PedidosService,
    public spinnerServ: SpinnerService,
    public mesasServ: MesasService,
    public pedidoServ: PedidoService,
  ) { }

  ngOnInit() {
  }

  public ionViewDidEnter() {
    this.inicioPagina();
  }

  public async inicioPagina() {
    // this.mostrarSpinner = true;
    this.spinnerServ.showLoadingSpinner();
    this.usuario = this.usuarioServ.getUsuarioStorage(); /* traerNombre('clientes'); */
    this.nombreUsuario = this.usuario.nombre;
    // this.puedeHacerDelivery = !this.authServ.esAnonimo();

    // if (this.puedeHacerDelivery) {
    //   // console.log('Puedo hacer delivery');

    //   this.userDelivery = this.traerUserDelivery(
    //     this.authServ.obtenerUID()
    //   ).subscribe((users: Array<any>) => {
    //     // El cliente está esperando un delivery
    //     if (users.length !== 0) {
    //       let auxDelivery = users;
    //       auxDelivery = auxDelivery.filter(
    //         ad => ad.estado !== diccionario.estados_delivery.entregado
    //       );
    //       if (auxDelivery.length > 0) {
    //         this.puedeHacerDelivery = false;
    //         this.puedeSolicitarMesa = false;
    //         this.puedeJugar = false;
    //         this.puedeVerPedido = false;
    //         this.puedeHacerPedido = false;
    //         this.esperandoAsignacion = false;
    //         this.flagEstaActivo = true;

    //         this.spinnerServ.hideLoadingSpinner();
    //         // console.log('El cliente espera un delivery');
    //       }
    //     }
    //   });
    // } else {
    //   // console.log('No puedo hacer delivery');
    // }

    // console.log('Reviso la lista de espera');
    this.userListaEspera = this.traerUserListaEspera(
      this.usuario.correo
    ).subscribe((users: Array<any>) => {
      this.listaEsperaUser = users;
      // El cliente no está en lista de espera, puede solicitar mesa o delivery
      console.log('Registros de la lista de espera', users);
      if (users.length === 0) {
        console.log('El cliente no está en la lista de espera');
        // this.puedeHacerDelivery = this.authServ.esAnonimo ? false : true;
        this.puedeSolicitarMesa = true;
        this.puedeJugar = false;
        this.puedeHacerPedido = false;
        this.puedeVerPedido = false;
        this.esperandoAsignacion = false;
        this.spinnerServ.hideLoadingSpinner();
        return;
      }

      this.puedeHacerPedido = true;
      this.puedeSolicitarMesa = false;
      this.spinnerServ.hideLoadingSpinner();
      // // reservas del cliente sin mesas asignadas
      // let auxListaEspera = users;
      // console.info("auxListaEspera", auxListaEspera);
      // auxListaEspera = auxListaEspera.filter(
      //   le =>
      //     (le.estado as string) ===
      //     diccionario.estados_reservas_agendadas.sin_mesa
      // );

      // // El cliente está en lista de espera
      // if (auxListaEspera.length === 1) {
      //   // console.log('El cliente está en la lista de espera pero sin mesa');
      //   this.puedeHacerDelivery = false;
      //   this.puedeSolicitarMesa = false;
      //   this.puedeJugar = false;
      //   this.puedeVerPedido = false;
      //   this.puedeHacerPedido = false;
      //   this.esperandoAsignacion = true;
      //   this.flagEstaActivo = true;
      //   this.spinnerServ.hideLoadingSpinner();
      // }
      // else {
      //   // Está en lista de espera con mesa asignada, se consulta la reserva
      //   console.log(
      //     'El cliente está en la lista de espera con mesa, se verifican las reservas'
      //   );
      //   this.traerUserReservas(this.usuario.id).subscribe(
      //     (usersAux: Array<Reserva>) => {
      //       console.log('Comienza a verificar las reservas');
      //       const auxReserva: Array<Reserva> = usersAux;
      //       let flagAux = false;
      //       // console.log('Reservas', auxReserva);

      //       for (let index = 0; index < auxReserva.length; index++) {
      //         console.log('Mesa de la reserva', auxReserva[index].mesa);
      //         this.mesa = auxReserva[index].mesa;
      //         // console.log('Numero de la mesa', this.mesa);
      //         if (
      //           auxReserva[index].estado ===
      //           diccionario.estados_reservas.en_curso
      //         ) {
      //           // Tiene una reserva en curso
      //           this.auxReserva = auxReserva[index];

      //           if (auxReserva[index].idPedido !== '') {
      //             // Tiene un pedido dentro de su reserva
      //             console.log('El cliente tiene un pedido en la reserva');
      //             this.auxPedido = auxReserva[index].idPedido;
      //             this.puedeJugar = this.authServ.esAnonimo ? false : true;
      //             this.puedeHacerPedido = false;
      //             this.puedeVerPedido = true;
      //             this.puedeHacerDelivery = false;
      //             this.puedeSolicitarMesa = false;
      //             this.esperandoAsignacion = false;
      //             this.flagEstaActivo = true;
      //             this.spinnerServ.hideLoadingSpinner();
      //             flagAux = true;
      //             break;
      //           }
      //           // No tiene un pedido dentro de su reserva
      //           if (!flagAux && index === auxReserva.length - 1) {
      //             console.log('El cliente no tiene un pedido en la reserva');
      //             this.auxPedido = undefined;
      //             this.puedeJugar = false;
      //             this.puedeVerPedido = false;
      //             this.puedeHacerPedido = true;
      //             this.puedeHacerDelivery = false;
      //             this.puedeSolicitarMesa = false;
      //             this.esperandoAsignacion = false;
      //             this.flagEstaActivo = true;
      //             this.spinnerServ.hideLoadingSpinner();
      //           }
      //         }
      //       }

      //       console.log('This.auxPedido', this.auxPedido);
      //       // Verifico estado del pedido
      //       if (this.auxPedido !== undefined) {
      //         this.watchPedido = this.db
      //           .collection('pedidos')
      //           .doc(this.auxPedido)
      //           .get()
      //           .subscribe((pedido: DocumentSnapshot<any>) => {
      //             const auxPedido = pedido.data() as Pedido;
      //             console.log('Pedido retornado de database', auxPedido);
      //             if (
      //               (auxPedido.estado as string) ===
      //               diccionario.estados_pedidos.cuenta ||
      //               (auxPedido.estado as string) ===
      //               diccionario.estados_pedidos.pagado ||
      //               (auxPedido.estado as string) ===
      //               diccionario.estados_pedidos.entregado
      //             ) {
      //               this.puedeJugar = false;
      //               this.puedeVerPedido = true;
      //               this.puedeHacerPedido = false;
      //               this.puedeHacerDelivery = false;
      //               this.puedeSolicitarMesa = false;
      //               this.esperandoAsignacion = false;
      //               this.flagEstaActivo = true;
      //             }
      //             if (
      //               (auxPedido.estado as string) ===
      //               diccionario.estados_pedidos.listo
      //             ) {
      //               this.puedeJugar = false;
      //             }
      //           });
      //       } else {
      //         this.spinnerServ.hideLoadingSpinner();
      //       }

      //       if (!this.flagEstaActivo) {
      //         this.puedeJugar = false;
      //         this.puedeVerPedido = false;
      //         this.puedeHacerPedido = false;
      //         this.puedeHacerDelivery = this.authServ.esAnonimo ? false : true;
      //         this.puedeSolicitarMesa = true;
      //         this.esperandoAsignacion = false;
      //         this.spinnerServ.hideLoadingSpinner();
      //       }

      //     }
      //   );
      // }
    });
  }

  public traerUserListaEspera(valor: string) {
    console.log("user valor", valor);
    return this.db
      .collection('esperaMesa')
      .snapshotChanges()
      .pipe(
        map(users => {
          const auxUsers: any = users.map(a => {
            const data: any = a.payload.doc.data();
            data.key = a.payload.doc.id;
            return data;
          });

          const auxRetorno: Array<any> = new Array<any>();
          for (const user of auxUsers) {
            // console.log(user.idUser, valor);
            if ((user.correo as string) === valor) {
              auxRetorno.push(user);
            }
          }
          // console.log(auxRetorno);
          return auxRetorno;
        })
      );
  }

  public traerUserReservas(valor: string) {
    return this.db
      .collection('reservas')
      .snapshotChanges()
      .pipe(
        map(users => {
          const auxUsers: any = users.map(a => {
            const data: any = a.payload.doc.data();
            data.key = a.payload.doc.id;
            return data;
          });

          const auxRetorno: Array<any> = new Array<any>();
          for (const user of auxUsers) {
            if ((user.cliente as string) === valor) {
              auxRetorno.push(user);
              // console.log('Añadido a la lista proveniente de la base de datos para las reservas');
            }
          }

          return auxRetorno;
        })
      );
  }

  public borrarUsuarioDeListaDeEspera(){

  }

  public solicitarMesa() {
    this.router.navigate(['/lista-espera-cliente'])
  }

  // Funcion usada tanto para hacer un pedido como para ver su estado
  public escanearQR(donde: string) {
    const options = { prompt: 'Escaneé el código QR de la mesa' };
    this.barcodeServ.scan(options).then(
      barcodeData => {
        this.idMesa = barcodeData.text;
        console.info("mesa scaneada", this.idMesa);
          donde === 'hacerPedido'
            ? this.irA('hacerPedido')
            : this.irA('verPedido');
        }, error => {
          this.toastServ.errorToast(`Error al scanear ${error}`);
        }
      );
  }

  irA(donde: string) {
    switch (donde) {
      // case 'bebida': {
      //   this.messageHandlerServ.mostrarMensajeCortoAbajo(
      //     'Página en construcción'
      //   );
      //   console.log(
      //     'Voy al juego para ganar una bebida con parametro { pedido: this.auxPedido }'
      //   );
      //   // Voy al juego para ganar una bebida con parametro { pedido: this.auxPedido }
      //   break;
      // }
      // case 'postre': {
      //   this.messageHandlerServ.mostrarMensajeCortoAbajo(
      //     'Página en construcción'
      //   );
      //   console.log(
      //     'Voy al juego para ganar un postre con parametro { pedido: this.auxPedido }'
      //   );
      //   // Voy al juego para ganar un postre con parametro { pedido: this.auxPedido }
      //   break;
      // }
      // case 'descuento': {
      //   this.messageHandlerServ.mostrarMensajeCortoAbajo(
      //     'Página en construcción'
      //   );
      //   console.log(
      //     'Voy al juego para ganar un descuento con parametro { pedido: this.auxPedido }'
      //   );
      //   // Voy al juego para ganar un descuento con parametro { pedido: this.auxPedido }
      //   break;
      // }
      case 'verPedido': {
        this.router.navigate(['estado-pedido', { mesa: this.mesa }]);
        // this.AgregarPedido();
        break;
      }
      case 'hacerPedido': {
        this.AgregarPedido();
        // this.router.navigate(['alta-pedido', { mesa: this.mesa }]);
        break;
      }
    }
  }

  public async AgregarPedido() {
    console.log('AgregarPedido');
    const modal = await this.modalCtrl.create({
      component: AltaPedidoPage,
      componentProps: { mesaDoc: this.idMesa }
    });
    modal.present();
    const pedido = await modal.onDidDismiss();
    console.log("vuelvo del alta", pedido);
    if (pedido.data !== undefined) {
      this.pedidoServ.savePedido(pedido.data)
      .then(res => {

        // Se elimina al usuario de la lista de espera
        this.db.collection("esperaMesa").doc(this.listaEsperaUser[0].id).delete()
        .then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });

        this.mesasServ.ObtenerMesas().subscribe(mesas=>{
          console.log("mesas", mesas);
        })

        this.toastServ.confirmationToast("Pedido solicitado");
        // this.spinnerServ.hideLoadingSpinner();
        // this.auxReserva.idPedido = data.id;
          // this.firebaseServ
          //   .actualizar('reservas', this.auxReserva.key, this.auxReserva)
          //   .then(() => {
          //     console.log('Se carga el pedido en la reserva');
          //   });
      })
      .catch(err => {
        // this.spinnerServ.hideLoadingSpinner();
        this.toastServ.errorToast("Error al intentar dar de alta" + err);
        console.error(err)
      })
    }
  }

}
