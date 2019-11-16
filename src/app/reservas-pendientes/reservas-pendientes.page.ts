import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../servicios/reservas.service';
import { Reserva } from '../clases/reserva';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-reservas-pendientes',
  templateUrl: './reservas-pendientes.page.html',
  styleUrls: ['./reservas-pendientes.page.scss'],
})
export class ReservasPendientesPage implements OnInit {

  listaReservas: Array<Reserva>;

  constructor(private reservas: ReservasService, private toast: ToastService) {
    this.TraerReservas();
   }

  TraerReservas()
  {
    this.reservas.TraerReservasPendientes().subscribe((data:Array<Reserva>)=>{
      this.listaReservas= data.map(function(reserva){
        return reserva;
      })
    console.log(this.listaReservas);
    })
  }

  AceptarReserva(reserva)
  {
    this.reservas.AceptarReserva(reserva).then(()=>{
      this.toast.confirmationToast("Reserva autorizada");
    })
  }

  CancelarReserva(reserva)
  {
    this.reservas.CancelarReserva(reserva).then(()=>{
      this.toast.confirmationToast("Reserva cancelada");
    })
  }

  ngOnInit() {
  }

}
