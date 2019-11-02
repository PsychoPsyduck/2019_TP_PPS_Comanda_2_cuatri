import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productosFirebase: AngularFirestoreCollection<any>;
  public productosObservable: Observable<any>;
  dbRef: AngularFirestoreCollection<any>;

  constructor(private objFirebase: AngularFirestore) {
    this.dbRef = this.objFirebase.collection("productos");
  }

  saveProduct(producto) {
    console.info("producto", producto);
    let id = this.objFirebase.createId();
    producto.id = id;
    return this.dbRef.doc(id).set(producto);
  }

  TraerProductos() {
    this.productosFirebase = this.objFirebase.collection<any>("productos", ref => ref.orderBy('nombre', 'asc'));
    this.productosObservable = this.productosFirebase.valueChanges();
    return this.productosObservable;
  }

}
