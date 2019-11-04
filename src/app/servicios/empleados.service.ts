import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ManejarDatosFoto } from './funcionesExtra';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Empleado } from '../clases/Empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(
    public db: AngularFirestore,
    public storage: AngularFireStorage
  ) { }

  public AgregarEmpleado(empleado: Empleado) {
    const picData = ManejarDatosFoto(empleado.foto);
    empleado.foto = '';

    return this.db.collection('empleados')
      .add(empleado)
      .then((doc: DocumentReference) => {
        this.SubirFoto(doc.id, empleado.dni, empleado.apellido, picData);
      })
      .catch((err: Error) => {
        alert(err);
      });
  }

  public SubirFoto(idDoc: string, dni: string, apellido: string, picData: any) {
    const type = picData.type.split('/')[1];
    const picName = `empleados/${dni}_${apellido}.${type}`;

    return this.storage.storage.ref(picName)
      .putString(picData.pic, picData.base,
        {
          contentType: picData.type
        })
      .then((uploadSnap: UploadTaskSnapshot) => {
        uploadSnap.ref.getDownloadURL().then((link) => {
          this.ActualizarEmpleadoFoto(idDoc, link);
        });
      })
      .catch((err: Error) => {
        console.log('Error en SubirFoto', err);
      });
  }

  public ActualizarEmpleadoFoto(idDoc: string, link: string) {
    return this.db.collection('empleados').doc(idDoc)
      .set({ foto: link }, { merge: true })
      .catch((err: Error) => {
        alert(err);
      });
  }
}
