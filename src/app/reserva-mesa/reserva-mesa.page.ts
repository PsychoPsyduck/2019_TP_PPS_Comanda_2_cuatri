import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../servicios/firebase.service';
import { SpinnerService } from '../servicios/spinner.service';
import { map } from 'rxjs/operators'
import { Mesa } from '../clases/mesa';

@Component({
  selector: 'app-reserva-mesa',
  templateUrl: './reserva-mesa.page.html',
  styleUrls: ['./reserva-mesa.page.scss'],
})
export class ReservaMesaPage implements OnInit {

  public idMesa: string;
  public tipo: string;
  public reservaAgendada: any;
  public mesa: Mesa;
  public mostrar: boolean;
  public watchMesasList: any;
  public watchReservasList: any;
  public watchReservasIdMesaList: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public db: AngularFirestore,
    public firebaseServ: FirebaseService,
    public spinnerServ: SpinnerService,
    // public parserTypesServ: ParserTypesService,
    // public messageHandlerServ: MessageHandlerService,
    // public notificationPushServ: NotificationPushService,
    ) { }

  ngOnInit() {
  }

  public obtenerMesa(idMesa: string) {
    return this.db.collection('mesas').snapshotChanges().pipe(map((mesas) => {
      const auxMesas: any = mesas.map((a) => {
        const data: any = a.payload.doc.data();
        data.key = a.payload.doc.id;
        return data;
      });

      const auxRetorno: Array<any> = new Array<any>();
      for (const mesaA of auxMesas) {
        // console.log(user, valor);
        if ((mesaA.id as string) === idMesa) {
          auxRetorno.push(mesaA);
          console.log('Añadido a la lista proveniente de la base de datos para mesas');
        }
      }

      return auxRetorno;
    }));
  }

  public obtenerReservas() {
    // this.mostrarSpinner = true;
    this.spinnerServ.showLoadingSpinner();
    this.idMesa = this.route.snapshot.paramMap.get('mesa');

    this.tipo = this.route.snapshot.paramMap.get('tipo');

    this.reservaAgendada = JSON.parse(this.route.snapshot.paramMap.get('reserva'));
    // console.log(this.route.snapshot.paramMap.get('reserva').toString());
    console.log('Mesa', this.idMesa, 'Reserva', this.reservaAgendada);

    this.watchReservasList = this.obtenerReservasConMesa()
      .subscribe((snapshots) => {
        const reservasAgendadas = snapshots;
        for (const reservaA of reservasAgendadas) {
          if ((reservaA.mesa as string) === this.idMesa) {
            if (!this.parserTypesServ.hayDiferenciaDe40Minutos(this.reservaAgendada.fecha, reservaA.fecha)) {
              // this.mostrarSpinner = false;
              this.messageHandlerServ.mostrarMensaje('Mesa ocupada');
              // this.spinnerServ.quitarSpinnerLogo();
              this.salir();
              return;
            }
          }
        }

        this.obtenerReservaIdMesa(this.idMesa)
          .subscribe((snapshotsMesa) => {
            const aux: any = snapshotsMesa;
            for (const reservaNormalA of snapshotsMesa) {
              if ((reservaNormalA.estado as string) === diccionario.estados_reservas.en_curso) {
                if (!this.parserTypesServ.hayDiferenciaDe40Minutos(this.reservaAgendada.fecha, reservaNormalA.fecha)) {
                  // this.mostrarSpinner = false;
                  // this.spinnerServ.quitarSpinnerLogo();
                  this.messageHandlerServ.mostrarErrorLiteral('Mesa ocupada');
                  this.salir();
                  return;
                }
              }
            }
            this.mostrar = true;
            // this.mostrarSpinner = false;
            this.spinnerServ.quitarSpinnerLogo();
          });
      });

    this.watchMesasList = this.obtenerMesa(this.idMesa)
      .subscribe(snapshots => {
        const auxMesas: Array<Mesa> = snapshots;
        this.mesa = new Mesa(auxMesas[0].id, auxMesas[0].comensales, auxMesas[0].tipo, auxMesas[0].foto, auxMesas[0].estado);
      });
  }

}
