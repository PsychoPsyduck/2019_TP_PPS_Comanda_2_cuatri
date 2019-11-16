import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/Usuario';
import { MailService } from './mail.service';
import { json } from 'functions/node_modules/@types/body-parser';
import { RegistroEspera } from '../clases/RegistroEspera';
import { userInfo } from 'os';
import { diccionario } from '../clases/diccionario';

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
    return this.dbRef.doc(id).set(usuario);
  }

  getUsuarioStorage() {
    if (sessionStorage.getItem("usuario"))
      return JSON.parse(sessionStorage.getItem("usuario"))
    else
      return false;
  }

  TraerUsuariosPendientes() {
    this.usuariosFirebase = this.objFirebase.collection<Usuario>("usuarios", ref => ref.where("estado", "==", "pendiente"));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;

  }

  BorrarUsuario(usr: Usuario) {
    return this.objFirebase.collection<any>("usuarios").doc(usr.id).delete();
  }


  TraerUsuarios() {
    this.usuariosFirebase = this.objFirebase.collection<Usuario>("usuarios", ref => ref.orderBy('correo', 'asc'));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;
  }

  GuardarUsuario(usuario) {

    let id = this.objFirebase.createId();
    usuario.id = id;
    if(usuario.tipo=="anonimo")
    {
      sessionStorage.setItem("usuario",JSON.stringify(usuario));
    }

    return this.objFirebase.collection<any>("usuarios").doc(id).set(usuario);

  }


  CambiarEstado(usr:Usuario)
  {
    usr.estado="pendiente";
    return this.objFirebase.collection<any>("usuarios").doc(usr.id).update(usr);
  }

  async TraerListaEsperaMesa() {

    this.usuariosFirebase = this.objFirebase.collection<RegistroEspera>("esperaMesa", ref => ref.orderBy('fecha', 'asc'));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;
  }

  AgregarListaEsperaMesa(usr)
  {
    let id = this.objFirebase.createId();
    let registro;
    if(usr.tipo =="anonimo")
    {
       registro= {
        id:id,
        fecha: Date.now(),
        nombre: usr.nombre,
        idUsuario: usr.id,
        foto:usr.foto
      }
    }
    else
    {
      registro= {
        id:id,
        fecha: Date.now(),
        nombre: usr.nombre,
        apellido: usr.apellido,
        correo: usr.correo,
        idUsuario: usr.id,
        foto:usr.foto
      }
    }

   return this.objFirebase.collection<any>("esperaMesa").doc(id).set(registro);
  }
}
