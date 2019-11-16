import { Component, OnInit } from '@angular/core';
import { Reserva } from '../clases/reserva';
import { AuthService } from '../servicios/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from '../servicios/firebase.service';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { ParserTypesService } from '../servicios/parser-types.service';
import { MessageHandlerService } from '../servicios/message-handler.service';
import { PedidosService } from '../servicios/pedidos.service';
import { SpinnerService } from '../servicios/spinner.service';
import { MesasService } from '../servicios/mesas.service';
import { map } from 'rxjs/operators'
import { diccionario } from '../clases/diccionario';
import { Pedido } from '../clases/pedido';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido.page';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-principal-cliente',
  templateUrl: './principal-cliente.page.html',
  styleUrls: ['./principal-cliente.page.scss'],
})
export class PrincipalClientePage implements OnInit {

  ngOnInit(){}

  public nombreUsuario: string;
  public mesa: string;
  public mesaDoc: string;
  public usuario;

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
  public userReservas: any;
  public watchPedido: any;

  constructor(
    public userServ: UsuariosService,
    public authServ: AuthService,
    public barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public firebaseServ: FirebaseService,
    public router: Router,
    // public notificationPushServ: NotificationPushService,
    public db: AngularFirestore,
    public parserServ: ParserTypesService,
    public messageHandlerServ: MessageHandlerService,
    public modalCtrl: ModalController,
    public pedidoServ: PedidosService,
    public spinnerServ: SpinnerService,
    public mesasServ: MesasService
  ) { }

  public ionViewDidEnter() {
    this.usuario = this.userServ.getUsuarioStorage();
    this.inicioPagina();
  }

  public ionViewDidLeave() {
    if (this.userDelivery) {
      this.userDelivery.unsubscribe();
    }
    if (this.userListaEspera) {
      this.userListaEspera.unsubscribe();
    }
    if (this.userReservas) {
      this.userReservas.unsubscribe();
    }
    if (this.watchPedido) {
      this.watchPedido.unsubscribe();
    }
  }

  public traerUserDelivery(valor: string) {
    return this.db
      .collection('delivery')
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
              // console.log('Añadido a la lista proveniente de la base de datos para delivery');
            }
          }

          return auxRetorno;
        })
      );
  }

  public traerUserListaEspera(valor: string) {
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
            // console.log(user, valor);
            if ((user.clienteId as string) === valor) {
              auxRetorno.push(user);
              // console.log('Añadido a la lista proveniente de la base de datos para lista de espera');
            }
          }

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

  public async inicioPagina() {
    // this.mostrarSpinner = true;
    this.spinnerServ.showLoadingSpinner();
    this.nombreUsuario = this.usuario.nombre; /* traerNombre('clientes'); */
    // this.puedeHacerDelivery = !this.authServ.esAnonimo();

    if (this.puedeHacerDelivery) {
      // console.log('Puedo hacer delivery');

      this.userDelivery = this.traerUserDelivery(
        this.usuario.id
      ).subscribe((users: Array<any>) => {
        // El cliente está esperando un delivery
        if (users.length !== 0) {
          let auxDelivery = users;
          auxDelivery = auxDelivery.filter(
            ad => ad.estado !== diccionario.estados_delivery.entregado
          );
          if (auxDelivery.length > 0) {
            this.puedeHacerDelivery = false;
            this.puedeSolicitarMesa = false;
            this.puedeJugar = false;
            this.puedeVerPedido = false;
            this.puedeHacerPedido = false;
            this.esperandoAsignacion = false;
            this.flagEstaActivo = true;

            this.spinnerServ.hideLoadingSpinner();
            // console.log('El cliente espera un delivery');
          }
        }
      });
    } else {
      // console.log('No puedo hacer delivery');
    }

    // console.log('Reviso la lista de espera');
    this.userListaEspera = this.traerUserListaEspera(
      this.usuario.id
    ).subscribe((users: Array<any>) => {
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

      let auxListaEspera = users;
      auxListaEspera = auxListaEspera.filter(
        le =>
          (le.estado as string) ===
          diccionario.estados_reservas_agendadas.sin_mesa
      );

      // El cliente está en lista de espera
      if (auxListaEspera.length === 1) {
        // console.log('El cliente está en la lista de espera pero sin mesa');
        this.puedeHacerDelivery = false;
        this.puedeSolicitarMesa = false;
        this.puedeJugar = false;
        this.puedeVerPedido = false;
        this.puedeHacerPedido = false;
        this.esperandoAsignacion = true;
        this.flagEstaActivo = true;
        this.spinnerServ.hideLoadingSpinner();
      } else {
        // Está en lista de espera con mesa asignada, se consulta la reserva
        console.log(
          'El cliente está en la lista de espera con mesa, se verifican las reservas'
        );
        this.traerUserReservas(this.usuario.id).subscribe(
          (usersAux: Array<Reserva>) => {
            console.log('Comienza a verificar las reservas');
            const auxReserva: Array<Reserva> = usersAux;
            let flagAux = false;
            // console.log('Reservas', auxReserva);

            for (let index = 0; index < auxReserva.length; index++) {
              console.log('Mesa de la reserva', auxReserva[index].idMesa);
              this.mesa = auxReserva[index].idMesa;
              // console.log('Numero de la mesa', this.mesa);
              if (
                auxReserva[index].estado ===
                diccionario.estados_reservas.en_curso
              ) {
                // Tiene una reserva en curso
                this.auxReserva = auxReserva[index];

                if (auxReserva[index].idPedido !== '') {
                  // Tiene un pedido dentro de su reserva
                  console.log('El cliente tiene un pedido en la reserva');
                  this.auxPedido = auxReserva[index].idPedido;
                  // this.puedeJugar = this.authServ.esAnonimo ? false : true;
                  this.puedeHacerPedido = false;
                  this.puedeVerPedido = true;
                  this.puedeHacerDelivery = false;
                  this.puedeSolicitarMesa = false;
                  this.esperandoAsignacion = false;
                  this.flagEstaActivo = true;
                  this.spinnerServ.hideLoadingSpinner();
                  flagAux = true;
                  break;
                }
                // No tiene un pedido dentro de su reserva
                if (!flagAux && index === auxReserva.length - 1) {
                  console.log('El cliente no tiene un pedido en la reserva');
                  this.auxPedido = undefined;
                  this.puedeJugar = false;
                  this.puedeVerPedido = false;
                  this.puedeHacerPedido = true;
                  this.puedeHacerDelivery = false;
                  this.puedeSolicitarMesa = false;
                  this.esperandoAsignacion = false;
                  this.flagEstaActivo = true;
                  this.spinnerServ.hideLoadingSpinner();
                }
              }
            }

            console.log('This.auxPedido', this.auxPedido);
            // Verifico estado del pedido
            if (this.auxPedido !== undefined) {
              this.watchPedido = this.db
                .collection('pedidos')
                .doc(this.auxPedido)
                .get()
                .subscribe((pedido: DocumentSnapshot<any>) => {
                  const auxPedido = pedido.data() as Pedido;
                  console.log('Pedido retornado de database', auxPedido);
                  if (
                    (auxPedido.estado as string) ===
                    diccionario.estados_pedidos.cuenta ||
                    (auxPedido.estado as string) ===
                    diccionario.estados_pedidos.pagado ||
                    (auxPedido.estado as string) ===
                    diccionario.estados_pedidos.entregado
                  ) {
                    this.puedeJugar = false;
                    this.puedeVerPedido = true;
                    this.puedeHacerPedido = false;
                    this.puedeHacerDelivery = false;
                    this.puedeSolicitarMesa = false;
                    this.esperandoAsignacion = false;
                    this.flagEstaActivo = true;
                  }
                  if (
                    (auxPedido.estado as string) ===
                    diccionario.estados_pedidos.listo
                  ) {
                    this.puedeJugar = false;
                  }
                });
            } else {
              this.spinnerServ.hideLoadingSpinner();
            }

            if (!this.flagEstaActivo) {
              this.puedeJugar = false;
              this.puedeVerPedido = false;
              this.puedeHacerPedido = false;
              // this.puedeHacerDelivery = this.authServ.esAnonimo ? false : true;
              this.puedeSolicitarMesa = true;
              this.esperandoAsignacion = false;
              this.spinnerServ.hideLoadingSpinner();
            }

          }
        );
      }
    });
  }

  // Este es para el qr de ingreso
  public solicitarMesa() {
    // console.log('Solicito una mesa');
    this.barcodeScanner.scan().then(
      barcodeData => {
        const barcodeText = barcodeData.text;

        if (barcodeText === diccionario.qr.ingreso_local) {
          this.infoReserva();
        } else {
          this.messageHandlerServ.mostrarMensaje('Error al ingresar al local.');
          // console.log('Error al ingresar al local');
        }
      },
      error => {
        // Hardcodeo
        // this.infoReserva();
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Hubo un error' + error
        );
        console.log('Hubo un error', error);
      }
    );
  }

  // Esto permite entrar a la lista de espera
  public async infoReserva() {
    // console.log('Información de la reserva');

    const alert = await this.alertCtrl.create({
      header: 'Reservar mesa',
      inputs: [
        {
          name: 'comensales',
          placeholder: 'Cantidad de comensales',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Click en cancelar.');
          }
        },
        {
          text: 'Reservar',
          handler: data => {
            this.guardarEnListaDeEspera(data.comensales);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  // Guarda los datos en la lista de espera
  public guardarEnListaDeEspera(comensales: number) {
    // this.mostrarSpinner = true;
    this.spinnerServ.showLoadingSpinner();
    // console.log('Guardo en Lista de Espera', 'Comensales:', comensales);
    const fecha: Date = new Date();
    const listaEspera: any = {
      estado: diccionario.estados_reservas_agendadas.sin_mesa,
      fecha: this.parserServ.parseDateTimeToStringDateTime(fecha),
      clienteId: this.usuario.id,
      comensales,
      nombre: this.nombreUsuario
    };
    this.firebaseServ
      .crear('esperaMesa', listaEspera)
      .then((doc: DocumentReference) => {
        this.messageHandlerServ.mostrarMensaje(
          'Enseguida se le asignará una mesa.'
        );

        this.spinnerServ.hideLoadingSpinner();

        // Envia la notificación a los usuarios
        // this.notificationPushServ.solicitudDeMesa(this.nombreUsuario);
        this.puedeSolicitarMesa = false;
      });
  }

  // Funcion usada tanto para hacer un pedido como para ver su estado
  public escanearQR(donde: string) {
    const options = { prompt: 'Escaneé el código QR de la mesa' };
    this.barcodeScanner.scan(options).then(
      barcodeData => {
        const decodedQr = barcodeData.text.split('|');
        if (decodedQr[0] === this.mesa) {
          this.mesaDoc = decodedQr[1];
          donde === 'hacerPedido'
            ? this.irA('hacerPedido')
            : this.irA('verPedido');
          // console.log('Voy a la página correspondiente');
        } else {
          this.messageHandlerServ.mostrarMensaje(
            'El codigo de su mesa es incorrecto'
          );
        }
        // this.messageHandlerServ.mostrarMensaje('Mesa:' + this.mesa);
      },
      error => {
        // Datos hardcodeados
        this.mesa = 'mesa01';
        donde === 'hacerPedido'
          ? this.irA('hacerPedido')
          : this.irA('verPedido');
        console.log('Hubo un error', error);
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Hubo un error, ' + error
        );
      }
    );
  }

  irA(donde: string) {
    switch (donde) {
      case 'bebida': {
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Página en construcción'
        );
        console.log(
          'Voy al juego para ganar una bebida con parametro { pedido: this.auxPedido }'
        );
        // Voy al juego para ganar una bebida con parametro { pedido: this.auxPedido }
        break;
      }
      case 'postre': {
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Página en construcción'
        );
        console.log(
          'Voy al juego para ganar un postre con parametro { pedido: this.auxPedido }'
        );
        // Voy al juego para ganar un postre con parametro { pedido: this.auxPedido }
        break;
      }
      case 'descuento': {
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Página en construcción'
        );
        console.log(
          'Voy al juego para ganar un descuento con parametro { pedido: this.auxPedido }'
        );
        // Voy al juego para ganar un descuento con parametro { pedido: this.auxPedido }
        break;
      }
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
    // console.log('AgregarPedido');

    const modal = await this.modalCtrl.create({
      component: AltaPedidoPage,
      componentProps: { mesaDoc: this.mesaDoc }
    });
    modal.present();
    const pedido = await modal.onDidDismiss();
    console.log(pedido);
    if (pedido.data !== undefined) {
      this.firebaseServ.crear('pedidos', pedido.data)
        .then((data: DocumentReference) => {
          console.log('Regreso del AgregarPedido, ahora debo agregar el pedido a la reserva');

          this.auxReserva.idPedido = data.id;
          this.firebaseServ
            .actualizar('reservas', this.auxReserva.id, this.auxReserva)
            .then(() => {
              console.log('Se carga el pedido en la reserva');
            });
        });
    }
  }

}
