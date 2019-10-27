import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuariosFirebase: AngularFirestoreCollection<any>;
  public usuariosObservable: Observable<any>;


  dbRef: AngularFirestoreCollection<any>;

  constructor(private objFirebase: AngularFirestore) {
    this.dbRef = this.objFirebase.collection("usuarios");
  }

  saveUsuario(usuario) {
    let id = this.objFirebase.createId();
    usuario.id = id;
    console.info("saveUsuario usuario", usuario);
    return this.dbRef.doc(id).set(usuario);

  }

  TraerUsuarios() {
    this.usuariosFirebase = this.objFirebase.collection<Usuario>("usuarios", ref => ref.orderBy('correo', 'asc'));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;
  }

  GuardarUsuario(usuario) {

    let id = this.objFirebase.createId();
    usuario.id = id;

    return this.objFirebase.collection<any>("usuarios").doc(id).set(usuario).then((data) => {
      console.log(data);
    }).catch((data) => {
      console.log(data);
    })

  }
}
