import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastController, Events } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuariosLogin: Array<any> = [
    { id: 0, nombre: "admin", correo: "admin@gmail.com", clave: "admin" },
    { id: 1, nombre: "supervisor", correo: "supervisor@gmail.com", clave: "supervisor" },
  ]

  correo: string;
  clave: string;
  usuarios: Usuario[];
  procesando: boolean;
  constructor(
    private usrService: UsuariosService,
    private toastController: ToastController,
    private router: Router,
    public events: Events) {
    this.procesando = false;
    this.TraerUsuarios();
  }

  TraerUsuarios() {
    this.usrService.TraerUsuarios().subscribe((arrayUsuarios: Usuario[]) => {
      this.usuarios = arrayUsuarios.map(usr => {
        return usr
      })
      console.log(this.usuarios);
    })
  }

  Ingresar() {
    let toas = this.toastController.create(
      {
        message: "Usuario o contraseña inválidos.",
        duration: 3000,
        position: 'top'
      });

    this.procesando = true;
    let ok: boolean = false;
    this.usuarios.map(usr => {
      if (usr.correo == this.correo && usr.clave == this.clave) {
        ok = true;
        sessionStorage.setItem("usuario", JSON.stringify(usr));
        console.log("estas logueado: ", usr);
        this.procesando = false;
        this.events.publish('usuarioLogueado', usr.puesto);
        this.router.navigate(['/home']);
      }

    })
    if (!ok) {

      this.presentToast();

    }



  }

  onChange(id) {
    this.correo = this.usuariosLogin[id].correo;
    this.clave = this.usuariosLogin[id].clave;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario o contraseña invalidos.',
      position: "middle",
      duration: 2000
    });
    toast.present();
  }

  IrARegistro()
  {
    this.router.navigate(['/registro-cliente']);
  }

  ngOnInit() {
    if (sessionStorage.getItem("usuario")) {
      sessionStorage.removeItem("usuario");
    }
  }

}
