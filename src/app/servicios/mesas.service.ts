import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from './firebase.service';
import { Mesa } from '../clases/mesa';
import { map } from 'rxjs/operators'
import { ManejarDatosFoto } from './funcionesExtra';
import { diccionario } from '../clases/diccionario';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  constructor(
    public db: AngularFirestore,
    public storage: AngularFireStorage,
    public firebase: FirebaseService
  ) {
    console.log("Constructor de MesasService");
  }

  public OrdenarMesas(auxMesas: Mesa[]) {
    return auxMesas.sort((a: Mesa, b: Mesa) => {
      return (a.id as string).localeCompare(b.id);
    });
  }

  public ObtenerMesas() {
    return this.db
      .collection("mesas")
      .snapshotChanges()
      .pipe(
        map(mesas => {
          const auxMesas: Mesa[] = mesas.map(a => {
            const data = a.payload.doc.data() as Mesa;
            data.key = a.payload.doc.id;
            return data;
          });

          return this.OrdenarMesas(auxMesas);
        })
      );
  }

  public AgregarMesa(mesa: Mesa) {
    const picData = ManejarDatosFoto(mesa.foto);
    mesa.foto = "";
    mesa.estado = diccionario.estados_mesas.libre;

    return this.db
      .collection("mesas")
      .add(mesa)
      .then((doc: DocumentReference) => {
        this.SubirFoto(doc.id, mesa.id, picData);
      })
      .catch((err: Error) => {
        console.log("Error en AgregarMesa", err);
      });
  }

  public ModificarMesa(docId: string, mesa: Mesa, changePic: boolean) {
    mesa.estado =
      mesa.comensales === "0"
        ? diccionario.estados_mesas.libre
        : diccionario.estados_mesas.ocupada;

    let picData = "";
    if (changePic) {
      picData = ManejarDatosFoto(mesa.foto);
      mesa.foto = "";
    }

    return this.db
      .collection("mesas")
      .doc(docId)
      .set(mesa)
      .then(() => {
        if (changePic) {
          this.SubirFoto(docId, mesa.id, picData);
        }
      })
      .catch((err: Error) => {
        console.log("Error en ModificarMesa", err);
      });
  }

  public SubirFoto(idDoc: string, id: string, picData: any) {
    const type = picData.type.split("/")[1];
    const picName = `mesas/${id}.${type}`;

    console.log("Subo la foto");
    return this.storage.storage
      .ref(picName)
      .putString(picData.pic, picData.base, {
        contentType: picData.type
      })
      .then((uploadSnap: UploadTaskSnapshot) => {
        uploadSnap.ref.getDownloadURL().then(link => {
          this.ActualizarMesaFoto(idDoc, link);
        });
      })
      .catch((err: Error) => {
        console.log("Error en SubirFoto", err);
      });
  }

  public ActualizarMesaFoto(idDoc: string, link: string) {
    return this.db
      .collection("mesas")
      .doc(idDoc)
      .set({ foto: link }, { merge: true })
      .catch((err: Error) => {
        console.log("Error en ActualizarMesaFoto", err);
      });
  }

  LiberarMesa(mesaDoc) {
    return this.firebase.actualizar("/mesas", mesaDoc, {
      estado: diccionario.estados_mesas.libre
    });
  }

  OcuparMesa(mesaDoc) {
    return this.firebase.actualizar("/mesas", mesaDoc, {
      estado: diccionario.estados_mesas.ocupada
    });
  }
}
