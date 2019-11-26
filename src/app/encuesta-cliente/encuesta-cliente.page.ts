import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastService } from '../servicios/toast.service';
import { storage } from 'firebase';
import * as firebase from 'firebase';
import { Encuesta } from '../clases/Encuesta';
import { EncuestaService } from '../servicios/encuesta.service';
import { SpinnerService } from '../servicios/spinner.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {


  array_fotos: string[];
  array_fotos_storage: string[];


  
  constructor(private builder: FormBuilder, 
    private spinner: SpinnerService,
    private encuestaSer: EncuestaService,
    private toast: ToastService,
    private camera: Camera,
    private navCtrl: NavController
  ) { 
    this.array_fotos= new Array<string>();
  }

  primeraVez = new FormControl('', [
    Validators.required

  ]);

  servicio = new FormControl('', [
    Validators.required

  ]);

  comida = new FormControl('', [
    Validators.required

  ]);

  mesa = new FormControl('', [
    Validators.required

  ]);

  comentario = new FormControl('', [
    Validators.required
  ]);

  registroForm: FormGroup = this.builder.group({
    primeraVez: this.primeraVez,
    servicio: this.servicio,
    comida: this.comida,
    mesa: this.mesa,
    comentario: this.comentario,


  });

  async GuardarEncuesta()
  {
    this.spinner.showLoadingSpinner();

    if(this.array_fotos)
    {
      await this.GuardarFoto(JSON.parse(sessionStorage.getItem("usuario")).id)
    }

    let encuesta = new Encuesta();
    encuesta.comida = this.registroForm.value.comida;
    encuesta.servicio = this.registroForm.value.servicio;
    encuesta.primeraVez = this.registroForm.value.primeraVez;
    encuesta.mesa = this.registroForm.value.mesa;
    encuesta.comentario = this.registroForm.value.comentario;
    encuesta.fotos = this.array_fotos_storage;
    encuesta.fotos = this.array_fotos_storage;


    this.encuestaSer.GuardarEncuesta(encuesta).then(()=>{

      setTimeout(() => {
        this.spinner.hideLoadingSpinner();
        this.toast.confirmationToast("encuesta enviada")

      }, 2000);
    }).catch(()=>{
      setTimeout(() => {
        this.spinner.hideLoadingSpinner();
        this.toast.errorToast("No se guardo la encuesta");

      }, 2000);
    })

this.registroForm.reset();


    
  }

  Volver()
  {
    this.navCtrl.navigateRoot('/pedido-del-cliente');
  }

  
async GuardarFoto(idUsuario)
{
  

 await this.array_fotos.forEach(async f=>{
  let filename = 'fotos_encuesta/'+ idUsuario + Date.now();
    await storage().ref(filename).putString(f,'data_url');

    await firebase.storage().ref().child(filename).getDownloadURL().then(async (url)=>{
      this.array_fotos_storage.push(url);
     
    }).catch((data)=>{
      console.log(data);
    });
  })

  this.array_fotos.splice(0);
/*
  let  fotos = await storage().ref(filename).putString(this.fotoCliente,'data_url');

  await firebase.storage().ref().child(filename).getDownloadURL().then(async (url)=>{
    this.urlStorageFoto=url;
   console.log(url);
   this.fotoCliente="";
  }).catch((data)=>{
    console.log(data);
  });*/
}


  async TomarFoto()
{ 

console.log("array lenght:" + this.array_fotos.length);

  if(this.array_fotos.length <= 2)
  {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
     
      await this.camera.getPicture(options).then((imageData)=>{
  
      this.array_fotos.push('data:image/jpeg;base64,'+ imageData)
      
      }, (error)=>{
        
  
    });

  }
  else{
    this.toast.errorToast("Solo puedes tomar 3 fotos.")
  }



}












  ngOnInit() {
  }

}
