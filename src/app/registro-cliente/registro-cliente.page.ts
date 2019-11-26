import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BarcodeService } from '../servicios/barcode.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';
import * as firebase from 'firebase';
import { MailService } from '../servicios/mail.service';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SpinnerService } from '../servicios/spinner.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
})
export class RegistroClientePage implements OnInit {

  botonHabilitado: boolean=true;
  fotoCliente:string;
  urlStorageFoto:string;

  constructor(private builder: FormBuilder, 
    private barcodeScanner: BarcodeScanner,
    private usuarioService: UsuariosService,
    private toastCtrl: ToastController,
    private camera: Camera,
    private mailSrv: MailService,
    private spinner: SpinnerService,
  ) { }

  nombre = new FormControl('', [
    Validators.required
  ]);
  apellido = new FormControl('', [
    Validators.required
  ]);

  dni = new FormControl('', [
    Validators.required,
    Validators.minLength(7)
  ]);

  email = new FormControl('', [
    Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])

  ]);

  clave = new FormControl('', [
    Validators.required
  ]);

  foto = new FormControl('', [
    Validators.required
  ]);


  registroForm: FormGroup = this.builder.group({
    nombre: this.nombre,
    apellido: this.apellido,
    dni: this.dni,
    email: this.email,
    clave: this.clave,
    foto: this.foto

  });
  ngOnInit() {
  }

 async Registrar(){

  this.spinner.showLoadingSpinner();

    if(this.fotoCliente)
    {
      await this.GuardarFoto(this.registroForm.value.email)
    }
    
    let usuario = new Usuario();
    usuario.nombre = this.registroForm.value.nombre;
    usuario.apellido = this.registroForm.value.apellido;
    usuario.dni = this.registroForm.value.dni;
    usuario.correo = this.registroForm.value.email;
    usuario.clave = this.registroForm.value.clave;
    usuario.tipo = "cliente";
    usuario.estado = "pendiente";
    usuario.foto=this.urlStorageFoto;
    usuario.cuil=null;
    usuario.puesto="";
   

    this.usuarioService.GuardarUsuario(usuario.toJson()).then(res => {
      this.registroForm.reset();
      this.botonHabilitado = true;
      
      console.log(res);
      this.spinner.hideLoadingSpinner();
      this.presentToast("Por favor, verifica tu correo para completar el registro.");
      

    }, err => {
      this.spinner.hideLoadingSpinner();
      console.log(err)
      this.botonHabilitado = true;
    });

  }

  async presentToast(msj:string) {
    const toast = await this.toastCtrl.create({
      message: msj,
      position: "middle",
      duration: 3000
    });
    toast.present();
  }
/*
  LeerDni(){ 
    const options = { prompt: 'Escaneé su DNI', format: "PDF_417" };
    this.barcode.scan(options).then(barcodeData => {

      var split = barcodeData.text.split("@");
      console.log(split);

      this.registroForm.controls['nombre'].setValue(split[2]);
      this.registroForm.controls['apellido'].setValue(split[1]);
      this.registroForm.controls['dni'].setValue(parseInt(split[4]))
  }).catch(err => {
    console.log('Error', err);
  })
}*/

LeerDni() {

  const opciones: BarcodeScannerOptions = {
    preferFrontCamera: false, // iOS and Android
    showFlipCameraButton: true, // iOS and Android
    showTorchButton: true, // iOS and Android
    torchOn: true, // Android, launch with the torch switched on (if available)
    //saveHistory: true, // Android, save scan history (default false)
    prompt: "Scanee el DNI", // Android
    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    formats: "PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations: true, // iOS
    disableSuccessBeep: false // iOS and Android
  }

  this.barcodeScanner.scan(opciones).then(barcodeData => {
    //console.log('Barcode data', barcodeData);

    var split = barcodeData.text.split("@");
    console.log(split);
    if(split.length > 9)
    {
      this.registroForm.controls['nombre'].setValue(split[5]);
      this.registroForm.controls['apellido'].setValue(split[4]);
      this.registroForm.controls['dni'].setValue(parseInt(split[1]));
    }
    else{
      this.registroForm.controls['nombre'].setValue(split[2]);
      this.registroForm.controls['apellido'].setValue(split[1]);
      this.registroForm.controls['dni'].setValue(parseInt(split[4]));
    }

  }).catch(err => {
    console.log('Error', err);
  });

}

async SacarFoto(){

  const options: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }
   
    await this.camera.getPicture(options).then((imageData)=>{

    this.fotoCliente='data:image/jpeg;base64,'+ imageData;
    this.foto.setValue(this.fotoCliente);
    
    }, (error)=>{
      
this.presentToast("No se pudo tomar la foto.")
  });
}

async GuardarFoto(correo)
{
  let filename = 'fotos_usuarios/'+ correo; 
  let  fotos = await storage().ref(filename).putString(this.fotoCliente,'data_url');

  await firebase.storage().ref().child(filename).getDownloadURL().then(async (url)=>{
    this.urlStorageFoto=url;
   console.log(url);
   this.fotoCliente="";
  }).catch((data)=>{
    console.log(data);
  });
}
}
