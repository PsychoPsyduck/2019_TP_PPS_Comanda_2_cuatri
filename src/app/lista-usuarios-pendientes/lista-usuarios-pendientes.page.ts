import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastService } from '../servicios/toast.service';
import { MailService } from '../servicios/mail.service';

@Component({
  selector: 'app-lista-usuarios-pendientes',
  templateUrl: './lista-usuarios-pendientes.page.html',
  styleUrls: ['./lista-usuarios-pendientes.page.scss'],
})
export class ListaUsuariosPendientesPage implements OnInit {

listaUsuarios: Array<Usuario>;

  constructor(private usrService: UsuariosService, 
    private toast: ToastService,
    private mail: MailService
  ) { }

  BorrarUsuario(usuario:Usuario)
  {
    this.usrService.BorrarUsuario(usuario).then((data)=>
  {
    this.toast.confirmationToast("El usuario ha sido borrado.");
  })
  .catch((data)=>{
    this.toast.errorToast("No se pudo eliminar el usuario.");
  })
  }

  EnviarMail(usuario: Usuario)
  {
   this.mail.EnviarMail(usuario.correo,usuario.id).then(()=>{
    this.toast.confirmationToast("se ha enviadio el mail de confirmacion.");
   })
   .catch(()=>{
    this.toast.confirmationToast("Se ha enviadio el mail de confirmación.");
   })
  }

  ngOnInit() {
    this.usrService.TraerUsuariosPendientes().subscribe((listaObservable: Array<Usuario>)=>{
      this.listaUsuarios = listaObservable
    })
  }

}
