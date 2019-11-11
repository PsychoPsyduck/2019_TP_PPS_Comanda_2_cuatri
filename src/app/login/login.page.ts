import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastController, Events, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FcmService } from '../servicios/fcm.service';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  splash = true;

  usuariosLogin: Array<any> = [
    { id: 0, nombre: "admin", correo: "admin@gmail.com", clave: "admin" },
    { id: 1, nombre: "supervisor", correo: "supervisor@gmail.com", clave: "supervisor" },
    { id: 2, nombre: "clienteUno", correo: "cliente1@gmail.com", clave: "cliente" },
    { id: 3, nombre: "dueño", correo: "dueño@gmail.com", clave: "dueño" },
    { id: 4, nombre: "mozo", correo: "mozo@gmail.com", clave: "mozo" },
  ]

  correo: string;
  clave: string;
  usuarios: Usuario[];
  procesando: boolean;
  constructor(
    private toastSrv: ToastService,
    private usrService: UsuariosService,
    private toastController: ToastController,
    private router: Router,
    public events: Events,
  private platform: Platform,
private fcm: FcmService) {
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
                if (usr !== undefined) {
                let toast;
          //Si estoy en el dispositivo guardo el token para push
       


          if(this.platform.is('cordova')){
          
            this.fcm.getToken()
          }
        }
        console.log("estas logueado: ", usr);
        this.procesando = false;
        this.events.publish('usuarioLogueado', usr);
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
    setTimeout(() => this.splash = false, 4000);
    if (sessionStorage.getItem("usuario")) {
      sessionStorage.removeItem("usuario");
    }
  }

}
