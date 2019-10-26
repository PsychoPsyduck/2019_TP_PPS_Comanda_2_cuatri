import { Component, OnInit } from '@angular/core';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../usuarios.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo:string;
  clave:string;
  usuarios: Usuario[];
  procesando:boolean;
  constructor(private usrService: UsuariosService, private toastController: ToastController) {
    this.procesando=false;
    this.TraerUsuarios();
   }

  TraerUsuarios()
  {
    this.usrService.TraerUsuarios().subscribe((arrayUsuarios: Usuario[])=>
  {
    this.usuarios= arrayUsuarios.map(usr=>{
      return usr
    })
    console.log(this.usuarios);
  })
  }

  Ingresar()
  {
    let toas= this.toastController.create(
      {message:"Usuario o contraseña inválidos.", 
      duration: 3000,
      position: 'top'});

    this.procesando=true;
    let ok:boolean =false;
    this.usuarios.map(usr=>
    {
      if(usr.correo == this.correo && usr.clave == this.clave)
      {
        ok=true;
        sessionStorage.setItem("usuario", JSON.stringify(usr));
        console.log("estas logueado: ", usr);
        this.procesando=false;
      }

    })
    if(!ok)
    {

      this.presentToast();
    
    }

    

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario o contraseña invalidos.',
      position:"middle",
      duration: 2000
    });
    toast.present();
  }
  ngOnInit() {
  }

}
