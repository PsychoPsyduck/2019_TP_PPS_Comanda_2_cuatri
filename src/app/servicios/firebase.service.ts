import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentReference,
  QueryFn,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { ToastController } from "@ionic/angular";
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { ManejarDatosFoto } from "./funcionesExtra";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  dbRef: AngularFirestoreCollection<any>;

  constructor(
    public http: HttpClient,
    public db: AngularFirestore,
    public afs: AngularFireStorage,
    public toastController: ToastController
  ) {
    this.dbRef = this.db.collection("pedidos");
  }

  traerColeccion(path: string, query: QueryFn = null): Observable<DocumentChangeAction<unknown>[]> {
    if (query == null)
      return this.db.collection(path).snapshotChanges();
    else
      return this.db.collection(path, query).snapshotChanges();
  }

  traerUno(path: string, campo: string, valor: string) {
    return this.db
      .collection(path)
      .ref.where(campo, "==", valor)
      .get()
      .then(documento => {
        if (documento.docs.length > 0) {
          const usuario = documento.docs[0].data();
          return usuario;
        } else {
          return null;
        }
      });
  }

  public savePedido(objeto: any) {
    let id = this.db.createId();
    objeto.id = id;
    console.info("a guardar", objeto, this.dbRef)
    return this.dbRef.doc(id).set(objeto);
  }

  public crear(path: string, objeto: any): Promise<DocumentReference> {
    return this.db.collection(path).add(objeto);
  }

  public actualizar(path: string, doc: string, valor: any) {
    return this.db
      .collection(path)
      .doc(doc)
      .update(valor);
  }

  borrar(path: string, doc: string): void {
    this.db
      .collection(path)
      .doc(doc)
      .delete()
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.mostrarToast(error);
  }

  subirImagenYTraerURl(path: string, imagenBase64: string): Promise<any> {
    let picData = ManejarDatosFoto(imagenBase64);
    let type = picData.type.split("/")[1];
    return this.afs.storage
      .ref(`${path}.${type}`)
      .putString(picData.pic, picData.base, {
        contentType: picData.type
      })
      .then(data => data.ref.getDownloadURL());
  }

  async mostrarToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      showCloseButton: true,
      position: "top",
      closeButtonText: "CERRAR",
      color: "danger"
    });
    toast.present();
  }
}
