import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reserva } from '../clases/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private reservasFirebase: AngularFirestoreCollection<any>;
  public reservasObservable: Observable<any>;

  constructor(private objFirebase: AngularFirestore) {

  }

  TraerReservas() {

    this.reservasFirebase = this.objFirebase.collection<Reserva>("reservas", ref => ref.orderBy('fechaRegistro', 'asc'));
    this.reservasObservable = this.reservasFirebase.valueChanges();
    return this.reservasObservable;
  }

  AgendarReserva(reserva: Reserva) {

    let id = this.objFirebase.createId();
    reserva.id = id;
    let registro = {
      id: reserva.id,
      fechaRegistro: Date.now(),
      usuario: reserva.usuario,
      mesa: reserva.mesa,
      fecha: reserva.fecha,
      comensales: reserva.comensales,
      estado: reserva.estado,
      tipo: reserva.tipo

    }
    return this.objFirebase.collection<any>("reservas").doc(reserva.id).set(registro);
  }

  AceptarReserva(reserva: Reserva) {

    reserva.estado = "aceptada";
    return this.objFirebase.collection<any>("reservas").doc(reserva.id).update(JSON.parse(JSON.stringify(reserva)));
  }

  CancelarReserva(reserva: Reserva) {

    return this.objFirebase.collection<any>("reservas").doc(reserva.id).delete();
  }

  TraerReservasPendientes() {

    this.reservasFirebase = this.objFirebase.collection<Reserva>("reservas", ref => ref.where("estado", "==", "pendiente"));
    this.reservasObservable = this.reservasFirebase.valueChanges();
    return this.reservasObservable;
  }
}
