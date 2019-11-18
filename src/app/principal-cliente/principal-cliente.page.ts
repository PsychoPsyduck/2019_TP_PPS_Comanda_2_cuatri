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
import { AltaPedidoPage } from '../alta-pedido/alta-pedido.page';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-principal-cliente',
  templateUrl: './principal-cliente.page.html',
  styleUrls: ['./principal-cliente.page.scss'],
})
export class PrincipalClientePage implements OnInit {
  clienteAceptado: boolean;
  userPedidos: any;
  pedidoUser: any = undefined;

  public nombreUsuario: string;
  public mesa = undefined;
  public mesaDoc: string;
  public usuario;

  public puedeJugar = false;
  public puedeVerPedidoORealizarEncueta = false;
  public puedeSolicitarMesa;
  public puedeAsignarseMesaYGenerarPedido: boolean = false;
  public esperandoAsignacion = false;
  public auxPedido: any = undefined;
  public auxReserva: Reserva = undefined;
  public flagEstaActivo = true;

  public userDelivery: any;
  public userListaEspera: any;
  public userReservas: any;
  public userMesa: any;
  public watchPedido: any;

  constructor(
    // public notificationPushServ: NotificationPushService,
    public userServ: UsuariosService,
    public authServ: AuthService,
    public barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public firebaseServ: FirebaseService,
    public router: Router,
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

  public traerUserMesa(valor: string) {
    return this.db
      .collection('mesas')
      .snapshotChanges()
      .pipe(
        map(mesa => {
          const auxMesas: any = mesa.map(a => {
            const data: any = a.payload.doc.data();
            data.key = a.payload.doc.id;
            return data;
          });

          var auxRetorno: any;
          for (const mesa of auxMesas) {
            if ((mesa.ocupante as string) === valor) {
              auxRetorno = mesa;
              break;
              // console.log('Añadido a la lista proveniente de la base de datos para las reservas');
            }
          }

          return auxRetorno;
        })
      );
  }

  public traerUserPedidos(valor: string) {
    return this.db
      .collection('pedidos')
      .snapshotChanges()
      .pipe(
        map(pedido => {
          const auxPedido: any = pedido.map(a => {
            const data: any = a.payload.doc.data();
            data.key = a.payload.doc.id;
            return data;
          });

          var auxRetorno: any;
          for (const pedido of auxPedido) {
            if ((pedido.cliente as string) === valor) {
              auxRetorno = pedido;
              break;
              // console.log('Añadido a la lista proveniente de la base de datos para las reservas');
            }
          }
          return auxRetorno;
        })
      );
  }

  public async inicioPagina() {

    this.spinnerServ.showLoadingSpinner();
    this.nombreUsuario = this.usuario.nombre; /* traerNombre('clientes'); */

    // console.log('Reviso la lista de espera');
    this.userListaEspera = this.traerUserListaEspera(
      this.usuario.id
    ).subscribe((users: Array<any>) => {
      console.log('Registros de la lista de espera', users);

      if (users.length === 0) {
        // El cliente no está en lista de espera, puede solicitar mesa

        console.log('El cliente no está en la lista de espera');
        this.puedeSolicitarMesa = true;
        this.puedeVerPedidoORealizarEncueta = false;
        this.esperandoAsignacion = false;
        this.spinnerServ.hideLoadingSpinner();
        return;
      }

      this.esperandoAsignacion = true;
      let auxListaEspera = users;
      auxListaEspera = auxListaEspera.filter(
        le =>
          (le.estado as string) ===
          diccionario.estadod_lista_espera.aceptado
      );

      if (auxListaEspera.length === 1) {
        // El cliente está en lista de espera aceptado pero sin mesa

        this.puedeSolicitarMesa = false;
        this.clienteAceptado = true;

        //Revisa listado de mesas - Se busca la que tenga asignada el cliente
        this.userMesa = this.traerUserMesa(
          this.usuario.id
        ).subscribe((mesaDeUser) => {
          console.log('Registro de la mesa asignada al usuario', mesaDeUser);

          if (mesaDeUser != undefined) {
            //El cliente tiene una mesa relacionada

            if (mesaDeUser.estado === diccionario.estados_mesas.asignada) {
              //El cliente tiene mesa asignada

              console.log('El cliente tiene mesa asignada');
              this.mesa = mesaDeUser;
              this.puedeAsignarseMesaYGenerarPedido = true;
              this.puedeVerPedidoORealizarEncueta = false;
              this.esperandoAsignacion = false;
            }

            if (mesaDeUser.estado === diccionario.estados_mesas.ocupada) {
              // El cliente esta acupando una mesa

              this.userPedidos = this.traerUserPedidos(
                this.usuario.id
              ).subscribe((pedidoDeUser) => {
                console.log('Registro de pedido del usuario', pedidoDeUser);

                if (pedidoDeUser != undefined) {
                  // El cliente tiene un pedido
                  console.log('El cliente tiene pedido');

                  this.pedidoUser = pedidoDeUser;
                  this.puedeVerPedidoORealizarEncueta = true;
                  this.puedeAsignarseMesaYGenerarPedido = false;
                  this.puedeSolicitarMesa = false;
                  this.esperandoAsignacion = false;
                  this.spinnerServ.hideLoadingSpinner();
                  return;
                }
              });

            }

            this.spinnerServ.hideLoadingSpinner();
            return;
          }
        });

        this.flagEstaActivo = true;
        this.spinnerServ.hideLoadingSpinner();
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
          this.guardarEnListaDeEspera();
          // this.infoReserva();
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
            alert.dismiss();
            console.log('Click en cancelar.');
          }
        },
        {
          text: 'Reservar',
          handler: data => {
            // this.guardarEnListaDeEspera(data.comensales);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  // Guarda los datos en la lista de espera
  public guardarEnListaDeEspera() {
    this.spinnerServ.showLoadingSpinner();
    const fecha: Date = new Date();
    const listaEspera: any = {
      estado: diccionario.estadod_lista_espera.pendiente,
      fecha: this.parserServ.parseDateTimeToStringDateTime(fecha),
      clienteId: this.usuario.id,
      // comensales,
      nombre: this.nombreUsuario
    };
    this.firebaseServ
      .crear('esperaMesa', listaEspera)
      .then((doc: DocumentReference) => {
        this.messageHandlerServ.mostrarMensaje(
          'Te agregaste a la lista de espera. Aguardá que el mozo te asigne una mesa para continuar.'
        );

        this.spinnerServ.hideLoadingSpinner();

        // Envia la notificación a los usuarios
        // this.notificationPushServ.solicitudDeMesa(this.nombreUsuario);
        this.puedeSolicitarMesa = false;
      });
  }

  // Funcion usada tanto para asignarse mesa, hacer un pedido como para ver su estado
  public escanearQR(donde: string) {
    const options = { prompt: 'Escaneé el código QR de la mesa' };
    this.barcodeScanner.scan(options).then(
      barcodeData => {
        const decodedQr = barcodeData.text.split('@');
        if (decodedQr[0] === this.mesa.id) {
          this.mesaDoc = decodedQr[1];
          switch (donde) {
            case 'asignarseMesaYGenerarPedido':
              this.irA('asignarseMesaYGenerarPedido');
              break;
            case 'realizarEncuesta':
              this.irA('realizarEncuesta')
              break;
            case 'verPedido':
              this.irA('verPedido');
              break;
          }
          // console.log('Voy a la página correspondiente');
        } else {
          this.messageHandlerServ.mostrarMensaje(
            'El codigo de su mesa es incorrecto'
          );
        }
        // this.messageHandlerServ.mostrarMensaje('Mesa:' + this.mesa);
      },
      error => {
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
      case 'asignarseMesaYGenerarPedido': {
        this.AsignarseMesaYGenerarPedido(this.mesa, this.usuario);
        // this.AgregarPedido();
        break;
      }
      case 'verPedido': {
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Página en construcción'
        );
        // this.router.navigate(['estado-pedido', { mesa: this.mesa }]);
        break;
      }
      case 'realizarEncuesta': {
        this.messageHandlerServ.mostrarMensajeCortoAbajo(
          'Página en construcción'
        );
        // this.RealizarEncuesta();
        break;
      }
    }
  }
  RealizarEncuesta() {
    throw new Error("Method not implemented.");
  }

  AsignarseMesaYGenerarPedido(mesa: any, usuario: any) {
    if (this.mesa.id === mesa.id && this.usuario.id === usuario.id) {
      this.mesasServ.OcuparMesa(this.mesaDoc)
        .then(() => {
          this.messageHandlerServ.mostrarMensajeConfimación(
            `Estás ocupando la mesa ${mesa.id}, ya podes nuestros productos disponibles y realizar tu pedido.`);
          this.AgregarPedido();
        })
        .catch(err => {
          this.messageHandlerServ.mostrarError(`Tuvimos un problema, ${err}. Inténtalo nuevamente`)
        })
    }
  }

  public async AgregarPedido() {
    console.log('AgregarPedido');
    const modal = await this.modalCtrl.create({
      component: AltaPedidoPage,
      componentProps: { mesaDoc: this.mesaDoc, mesa: this.mesa }
    });
    modal.present();
    const pedido = await modal.onDidDismiss();
    console.log(pedido);
    if (pedido.data !== undefined) {
      this.firebaseServ.crear('pedidos', pedido.data)
        .then((data: DocumentReference) => {
          console.log('Regreso del AgregarPedido, ahora debo agregar el pedido a la reserva');
          this.messageHandlerServ.mostrarMensajeConfimación("Pedido registrado, puede hacer el seguimiento del mismo volviendo a escanear el código QR de su mesa");
        });
    }
  }

  ngOnInit() { }
}
