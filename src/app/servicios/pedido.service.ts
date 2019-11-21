import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private pedidosFirebase: AngularFirestoreCollection<any>;
  public pedidosObservable: Observable<any>;
  dbRef: AngularFirestoreCollection<any>;

  constructor(private objFirebase: AngularFirestore) {
    this.dbRef = this.objFirebase.collection("pedidos");
  }

  savePedido(pedido) {
    let id = this.objFirebase.createId();

    var prods = [];
    pedido.productoPedido.forEach(element => {
      var prod = {
        cantidad: element.cantidad,
        nombre: element.nombre,
        idProducto: element.idProducto,
        estado: element.estado,
        precio: element.precio
      }
      prods.push(prod);
    });

    const pedidoToSave = {
      productos: prods,
      mesa: pedido.mesa,
      estado: pedido.estado,
      isDelivery: pedido.isDelivery,
      id: id
    }

    return this.objFirebase.collection("pedidos").doc(id).set(pedidoToSave);
  }

  TraerPedidos() {
    this.pedidosFirebase = this.objFirebase.collection<any>("pedidos", ref => ref.orderBy('nombre', 'asc'));
    this.pedidosObservable = this.pedidosFirebase.valueChanges();
    return this.pedidosObservable;
  }

  PedidosObservable()
  {
    this.pedidosFirebase = this.objFirebase.collection<any>("pedidos");
    this.pedidosObservable = this.pedidosFirebase.valueChanges();
    return this.pedidosObservable;
  }

  TraerPedidoPorCliente(cliente:string)
  {
    this.pedidosFirebase = this.objFirebase.collection("pedidos", ref=>ref.where("cliente", "==", cliente));
    this.pedidosObservable = this.pedidosFirebase.snapshotChanges();
    return this.pedidosObservable;
  }

  ModificarPorCliente(pedido, estado, key)
  {
    pedido.estado=estado;
    return this.objFirebase.collection<any>("pedidos").doc(key).update(pedido);
  }

}
