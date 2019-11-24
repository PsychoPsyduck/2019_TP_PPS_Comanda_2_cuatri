import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastController, Events, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastService } from '../servicios/toast.service';
import { PushNotificationService } from '../servicios/push-notification.service';
import { SpinnerService } from '../servicios/spinner.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // splash = true;
  splash = false;
  correo: string;
  clave: string;
  usuarios: Usuario[];
  procesando: boolean;

  usuariosLogin: Array<any> = [
    { id: 0, nombre: "admin", correo: "admin@gmail.com", clave: "admin" },
    { id: 1, nombre: "dueño", correo: "dueño@gmail.com", clave: "dueño" },
    { id: 2, nombre: "supervisor", correo: "gastonpesoa@gmail.com", clave: "gaston" },
    { id: 3, nombre: "mozo", correo: "mozo@gmail.com", clave: "mozo" },
    { id: 4, nombre: "clienteUno", correo: "cliente1@gmail.com", clave: "cliente" },
    { id: 5, nombre: "clienteDos", correo: "marcos98c@gmail.com", clave: "123" },
    { id: 6, nombre: "cocinero", correo: "cocinero@gmail.com", clave: "cocinero" },
    { id: 7, nombre: "bartender", correo: "bartender@gmail.com", clave: "bartender" },
    { id: 8, nombre: "tester", correo: "ozucoma-1729@yopmail.com", clave: "123" }
  ]

  constructor(
    private toastSrv: ToastService,
    private usrService: UsuariosService,
    private toastController: ToastController,
    private router: Router,
    public events: Events,
    private platform: Platform,
    private spinner: SpinnerService,
    // private fcm: FcmService,
    private notifServ: PushNotificationService) {
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

    this.spinner.showLoadingSpinner();

    let toas = this.toastController.create(
      {
        message: "Usuario o contraseña inválidos.",
        duration: 3000,
        position: 'top'
      });

    this.procesando = true;
    let ok: boolean = false;
    this.usuarios.map(usr => {
      if (usr.correo == this.correo && usr.clave == this.clave && usr.estado == "activo") {

        ok = true;
        sessionStorage.setItem("usuario", JSON.stringify(usr));
        if (usr !== undefined) {
          let toast;
          //Si estoy en el dispositivo guardo el token para push


          // if(this.platform.is('cordova')){

          //   this.fcm.getToken()
          // }
        }
        console.log("estas logueado: ", usr);
        this.procesando = false;
        this.notifServ.actualizarTokenDispositivo();
        this.events.publish('usuarioLogueado', usr);
        setTimeout(() => {
          this.spinner.hideLoadingSpinner();
        }, 2000);
        this.router.navigate(['/home']);
      }
    })
    if (!ok) {
      setTimeout(() => {
        this.spinner.hideLoadingSpinner();
      }, 2000);
      
      this.presentToast();
    }
  }

  IngresarAnonimo() {
    this.router.navigate(['/ingreso-anonimo']);
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

  IrARegistro() {
    this.router.navigate(['/registro-cliente']);
  }

  ngOnInit() {
    setTimeout(() => this.splash = false, 4000);
  }

}
