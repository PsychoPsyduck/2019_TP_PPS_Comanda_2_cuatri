import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '../servicios/toast.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';
import * as firebase from 'firebase';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';
// import { FcmService } from '../servicios/fcm.service';
import { Platform, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { SpinnerService } from '../servicios/spinner.service';

@Component({
  selector: 'app-ingreso-anonimo',
  templateUrl: './ingreso-anonimo.page.html',
  styleUrls: ['./ingreso-anonimo.page.scss'],
})
export class IngresoAnonimoPage implements OnInit {

  botonHabilitado: boolean = true;
  fotoCliente: string;
  urlStorageFoto: string;

  constructor(private builder: FormBuilder,
    private toast: ToastService,
    private camera: Camera,
    private router: Router,
    private usuarioService: UsuariosService,
    public events: Events,
    private platform: Platform,
    private spinner:SpinnerService,
    // private fcm: FcmService
  ) { }

  nombre = new FormControl('', [
    Validators.required
  ]);

  foto = new FormControl('', [
    Validators.required
  ]);


  registroForm: FormGroup = this.builder.group({
    nombre: this.nombre,
    foto: this.foto

  });

  async Registrar() {
this.spinner.showLoadingSpinner()
    if (this.fotoCliente) {
      await this.GuardarFoto(this.registroForm.value.nombre)
    }

    let usuario = new Usuario();
    usuario.nombre = this.registroForm.value.nombre;
    usuario.apellido = "";
    usuario.dni = 0;
    usuario.correo = "";
    usuario.clave = "";
    usuario.tipo = "anonimo";
    usuario.estado = "activo";
    usuario.foto = this.urlStorageFoto;
    usuario.cuil = 0;
    usuario.puesto = "";


    this.usuarioService.GuardarUsuario(usuario.toJson()).then(res => {
      setTimeout(() => {
        this.spinner.hideLoadingSpinner()
      }, 3000);
      this.registroForm.reset();
      this.botonHabilitado = true;
      if (usuario !== undefined) {
        let toast;
        //Si estoy en el dispositivo guardo el token para push



        // if (this.platform.is('cordova')) {

        //   this.fcm.getToken()
        // }
      }
      console.log("estas logueado: ", usuario);
      this.events.publish('usuarioLogueado', usuario);
      this.router.navigate(['/home']);

    }, err => {
      console.log(err)
      this.botonHabilitado = true;
    });

  }


  async SacarFoto() {

    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    await this.camera.getPicture(options).then((imageData) => {
      this.fotoCliente = 'data:image/jpeg;base64,' + imageData;
      this.foto.setValue(this.fotoCliente);
    }, (error) => {

      this.toast.errorToast("No se pudo tomar la foto.");
    });
  }

  async GuardarFoto(nombre) {
    let filename = 'fotos_usuarios/' + nombre;
    let fotos = await storage().ref(filename).putString(this.fotoCliente, 'data_url');

    await firebase.storage().ref().child(filename).getDownloadURL().then(async (url) => {
      this.urlStorageFoto = url;
      console.log(url);
      this.fotoCliente = "";
    }).catch((data) => {
      console.log(data);
    });
  }
  ngOnInit() {
  }

}
