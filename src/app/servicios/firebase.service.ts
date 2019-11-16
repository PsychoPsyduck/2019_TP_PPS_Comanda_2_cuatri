import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore, QueryFn, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ManejarDatosFoto } from './funcionesExtra';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public http: HttpClient,
    public db: AngularFirestore,
    public afs: AngularFireStorage,
    public toastController: ToastController
  ) {}

  traerColeccion(path: string, query: QueryFn = null): Observable<DocumentChangeAction<unknown>[]> {
    if(query == null)
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

  public crear(path: string, objeto: any): Promise<DocumentReference> {
    // console.log('Entro al crear');
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
