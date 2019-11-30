import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastService } from '../servicios/toast.service';
import { MesasService } from '../servicios/mesas.service';
import { Mesa } from '../clases/mesa';
import { Usuario } from '../clases/Usuario';
import { ReservasService } from '../servicios/reservas.service';
import { Reserva } from '../clases/reserva';
import { RegistroEspera } from '../clases/RegistroEspera';
import { PedidoService } from '../servicios/pedido.service';
import { Subscription } from 'rxjs';
import { AltaPedidoPage } from '../alta-pedido/alta-pedido.page';
import { FirebaseService } from '../servicios/firebase.service';
import { DocumentReference } from '@angular/fire/firestore';
import { Router, NavigationExtras } from '@angular/router';



@Component({
  selector: 'app-scan-mesa',
  templateUrl: './scan-mesa.page.html',
  styleUrls: ['./scan-mesa.page.scss'],
})
export class ScanMesaPage implements OnInit {

  esperaSubs: Subscription;
  mesaSubs: Subscription;
  reservaSubs: Subscription;
  reservaSubs2: Subscription;
  pedidoSubs: Subscription;
  pedidosSub2: Subscription;
  usrConReserva = false;
  mesaReservada = false;
  listaEsperas: Array<RegistroEspera>;
  listaMesas: Array<any>;
  listaRservas: Array<Reserva>;
  listaPedidos;
  estaEnLista = false;
  usuarioHabilitado = false;
  mesaHabilitada = true;
  sinReserva = true;
  tienePedido;
  puedeAltaPedido;
  estadoPedido: string;
  mesa: Mesa;
  usuario: Usuario;
  tokenPrueba: string = "YSNbdwHp6lTojjnM3xDS";
  mesaDoc: any;

  constructor(private navCtrl: NavController,
    private barcode: BarcodeScanner,
    private usrServ: UsuariosService,
    private toast: ToastService,
    private mesaServ: MesasService,
    private reservas: ReservasService,
    private pedidoServ: PedidoService,
    public modalCtrl: ModalController,
    public firebaseServ: FirebaseService,
    private router: Router
  ) {


    this.Scan();

  }


  async Scan() {
    var keyMesa;
    this.barcode.scan().then(async barcodeData => {
      keyMesa = barcodeData.text;

      //keyMesa= "fzMeTAWWdVzLR7yG7sNp";

      var usuario = JSON.parse(sessionStorage.getItem("usuario"))
      this.usuario = usuario;
      this.esperaSubs = await this.usrServ.TraerEsperasObservable().subscribe((data) => {
        this.listaEsperas = data;
        this.listaEsperas.forEach((espera: RegistroEspera) => {

          if (espera.idUsuario == usuario.id && espera.estado == "aceptado") {
            this.usuarioHabilitado = true;
            //console.log("usuario habilitado")
          }
          if (espera.idUsuario == usuario.id && espera.estado == 'pendiente') {
            this.estaEnLista = true;
            this.toast.errorToast("No estas aceptado");
            this.Navegar('/home');
          }
        })
        if (this.usuarioHabilitado == false && this.estaEnLista == false) {
          this.reservaSubs = this.reservas.TraerReservas().subscribe((dataReservas) => {
            dataReservas.forEach((reserva: Reserva) => {
              if (reserva.mesa == keyMesa && reserva.estado != "pendiente" &&
                ((Date.now() / 1000) / 60) <= ((Date.parse(reserva.fecha) / 1000) / 60) &&
                ((Date.now() / 1000) / 60) >= (((Date.parse(reserva.fecha) / 1000) / 60) - 40) &&
                reserva.usuario.id == usuario.id
              ) {
                this.pedidosSub2 = this.pedidoServ.TraerPedidos().subscribe((data_pedidos_dos: Array<any>) => {
                  data_pedidos_dos.map((p) => {
                    if (p.cliente == JSON.parse(sessionStorage.getItem("usuario")).id &&
                      p.estado != 'solicitado' && p.estado != 'cerrado') {
                      this.Navegar('/pedido-del-cliente');
                    }
                  })
                })
                this.toast.confirmationToast("podes tomar tu reserva");
                this.toast.errorToast("110")
                this.Navegar('/alta-pedido');
               
                // this.AgregarPedido();
                this.sinReserva = false;
              }
            });

            if (this.sinReserva == true) {
              this.toast.errorToast("Tenes que ingresarte a la lista de espera.");
              this.Navegar('/home');
            }
          })

        }

        if (this.usuarioHabilitado) {

          this.mesaSubs = this.mesaServ.ObtenerMesas().subscribe((data_mesas) => {
            this.listaMesas = data_mesas;

            this.listaMesas.forEach(async (mesa) => {
              console.log(mesa.key, keyMesa)
              if (mesa.key == keyMesa) {
                this.mesaDoc = keyMesa;
                this.mesa = mesa;
                if (mesa.estado == 'ocupada') {
                  console.log("mesa ocupada")

                  if (mesa.ocupante == usuario.id) {

                    this.pedidoSubs = this.pedidoServ.PedidosObservable().subscribe((data_pedidos) => {
                      this.listaPedidos = data_pedidos;
                      console.log(this.listaPedidos)
                      this.listaPedidos.forEach(pedido => {

                        if (pedido.cliente == usuario.id) {
                          this.tienePedido = true;
                          this.estadoPedido = pedido.estado;
                        }
                      });

                      if (this.tienePedido) {

                        if (this.estadoPedido != 'cerrado') {
                          // this.toast.confirmationToast("Podes llenar la encuesta");
                          this.Navegar('/pedido-del-cliente');
                        }
                        else {
                          this.Navegar('/home');
                        }
                        /* else{
                           this.toast.errorToast("Una vez aceptado el pedido podras hacer la encuesta.")
                           
                           this.Navegar('/home');
                         }*/

                      }
                      else {
                        console.log("hacer pedido")
                        // this.toast.errorToast("169")
                        this.Navegar('/alta-pedido')
                        
                        // this.AgregarPedido();
                      }

                    })
                  }
                  else {
                    this.mesaHabilitada = false;
                    this.toast.errorToast("mesa ocupada");
                    this.Navegar('/home')
                  }
                }

                if (mesa.estado == 'libre') {
                  this.reservaSubs2 = await this.reservas.TraerReservas().subscribe(async (data_res) => {

                    this.listaRservas = data_res;

                    await this.listaRservas.forEach((r) => {

                      let ahora = ((Date.now() / 1000) / 60);
                      let ahoraMas = ((Date.now() / 1000) / 60) + 10;
                      let minRsereva = ((Date.parse(r.fecha) / 1000) / 60);
                      let minLimite = ((Date.parse(r.fecha) / 1000) / 60) - 40;

                      if (r.mesa == keyMesa && r.estado == "aceptada" && ahora >= minLimite) {
                        if (r.usuario.id == usuario.id) {
                          this.usrConReserva = true;
                          this.toast.confirmationToast("Ocupaste la mesa que tenias reservada");

                          this.mesaServ.Ocupar(mesa, usuario).then(() => {
                            this.toast.errorToast("200")
                            this.Navegar('/alta-pedido');

                            // this.AgregarPedido();
                          });
                        }
                        else {
                          this.mesaReservada = true;
                        }

                      }
                    })
                    if (this.mesaReservada == false && this.usrConReserva == false) {
                      if (this.tienePedido) {
                        this.Navegar('/pedido-del cliente');
                      }
                      else {
                        this.toast.confirmationToast("Ocupaste la mesa");
                        this.mesaServ.Ocupar(mesa, usuario).then(() => {
                          // this.toast.errorToast("219")
                          this.Navegar('/alta-pedido');
                          // this.AgregarPedido();
                        })
                      }

                    }
                    if (this.mesaReservada == true) {
                      this.toast.errorToast("Mesa reservada");
                      this.Navegar('/home');
                    }
                  })


                }
              }
            })
          })
        }


      });



    }).catch(err => {
      console.log('Error', err);
    })

  }

  Navegar(path: string) {
    if (path == '/alta-pedido') {

      console.info("entre aca ", path, "user", this.usuario.id);

      let navigationExtras: NavigationExtras = {
        state: {
          user: this.usuario.id,
          mesa: this.mesaDoc
        }
      };

      // this.navCtrl.navigateRoot(['/alta-pedido'], {
      //   state: { mesa: this.mesaDoc }
      // })
      this.router.navigate(['/alta-pedido'], navigationExtras)
      .then(() => {
        this.esperaSubs.unsubscribe();
        this.mesaSubs.unsubscribe();
        this.reservaSubs.unsubscribe();
        this.pedidoSubs.unsubscribe();
        this.reservaSubs2.unsubscribe();
        this.pedidosSub2.unsubscribe();
      })

    } else {

      this.navCtrl.navigateRoot(path).then(() => {
        this.esperaSubs.unsubscribe();
        this.mesaSubs.unsubscribe();
        this.reservaSubs.unsubscribe();
        this.pedidoSubs.unsubscribe();
        this.reservaSubs2.unsubscribe();
        this.pedidosSub2.unsubscribe();
      })
    }
  }
  /*
      validarRserva(reserva, mesa)
      {
        let ahora=((Date.now() / 1000) /60);
        let ahoraMas=((Date.now() / 1000) /60)+10;
        let minRsereva= ((Date.parse(reserva.fecha)/1000)/60 );
        let minLimite = ((Date.parse(reserva.fecha)/1000)/60) -40;
        let reservada: boolean;
        if(reserva.mesa==mesa && reserva.estado == "aceptada" &&
        ahora <= minRsereva && 
        ahora >= minLimite)
      }*/

  ngOnInit() {

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
          this.router.navigate(['/home'])
          // this.Navegar('/home');
          this.toast.confirmationToast("Pedido registrado, puede hacer el seguimiento del mismo volviendo a escanear el código QR de su mesa");
        });
    }
  }


}
