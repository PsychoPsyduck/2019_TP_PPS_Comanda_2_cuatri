import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastService } from '../servicios/toast.service';
import { MailService } from '../servicios/mail.service';
import { SpinnerService } from '../servicios/spinner.service';

@Component({
  selector: 'app-lista-usuarios-pendientes',
  templateUrl: './lista-usuarios-pendientes.page.html',
  styleUrls: ['./lista-usuarios-pendientes.page.scss'],
})
export class ListaUsuariosPendientesPage implements OnInit {

listaUsuarios: Array<Usuario>;

  constructor(private usrService: UsuariosService, 
    private toast: ToastService,
    private mail: MailService,
    private spinner: SpinnerService,
  ) { }

  BorrarUsuario(usuario:Usuario)
  {
    this.spinner.showLoadingSpinner();

    this.usrService.BorrarUsuario(usuario).then((data)=>
  { 
    this.mail.EnviarMailRechazo(usuario.correo).then(()=>{

      setTimeout(() => {
        this.spinner.hideLoadingSpinner();
      }, 2000);

    this.toast.confirmationToast("se ha enviadio el mail de rechazo.");

  }).catch(()=>{

    setTimeout(() => {
      this.spinner.hideLoadingSpinner();
    }, 2000);

    this.toast.confirmationToast("se ha enviadio el mail de rechazo.");
  })
    this.toast.confirmationToast("El usuario ha sido borrado.");
  })
  .catch((data)=>{

    this.toast.errorToast("No se pudo eliminar el usuario.");
  })
  }

  EnviarMail(usuario: Usuario)
  {
    this.spinner.showLoadingSpinner();

    this.usrService.AguardaConfiracion(usuario).then(()=>{

      
   this.mail.EnviarMail(usuario.correo,usuario.id).then(()=>{

    setTimeout(() => {
      this.spinner.hideLoadingSpinner();
    }, 2000);

    this.toast.confirmationToast("se ha enviadio el mail de confirmacion.");
   })
   .catch(()=>{

    setTimeout(() => {

      this.spinner.hideLoadingSpinner();
    }, 2000);
    
    this.toast.confirmationToast("Se ha enviadio el mail de confirmación.");
   })

    })

  }

  ngOnInit() {
    this.usrService.TraerUsuariosPendientes().subscribe((listaObservable: Array<Usuario>)=>{
      this.listaUsuarios = listaObservable
    })
  }

}
