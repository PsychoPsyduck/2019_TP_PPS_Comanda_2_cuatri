import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CamaraService } from '../servicios/camara.service';
import { ToastService } from '../servicios/toast.service';
import { Events } from '@ionic/angular';
import { SpinnerService } from '../servicios/spinner.service';
import { BarcodeService } from '../servicios/barcode.service';
import { ProductoService } from '../servicios/producto.service';

@Component({
  selector: 'app-alta-prod',
  templateUrl: './alta-prod.page.html',
  styleUrls: ['./alta-prod.page.scss'],
})
export class AltaProdPage implements OnInit {

  altaProdForm: FormGroup;
  urlsFoto: Array<string>;
  fotosCargadas: boolean = false;
  usuario: any = null;

  constructor(private formBuilder: FormBuilder,
    private prodServ: ProductoService,
    private camServ: CamaraService,
    private barcodeScanner: BarcodeService,
    private toastServ: ToastService,
    public events: Events,
    public spinnerServ: SpinnerService) { }

  ngOnInit() {
    this.urlsFoto = new Array<string>();
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.altaProdForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]],
      descripcion: ['', [Validators.required, Validators.pattern("^[a-zA-Z ]+$")]],
      tiempo: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      precio: ['', [Validators.required, Validators.pattern("[0-9]+(\.[0-9][0-9]?)?")]]
    });
  }

  takeFoto() {
    this.camServ.takePhoto()
      .then(imgData => {
        if (imgData !== 'No Image Selected') {
          this.saveFoto(imgData);
          // this.fotos.push(`data:image/jpeg;base64,${imgData}`);
          // alert(this.fotos)
        }
      })
      .catch(error => {
        this.toastServ.errorToast(`Error al tomar foto: ${error.message}`);
      })
  }

  saveFoto(data: any) {
    this.spinnerServ.showLoadingSpinner();
    var res = this.camServ.uploadPhoto(data)
      .then((res) => {
        this.toastServ.confirmationToast("Foto guardada")
      })
      .catch(err => {
        this.toastServ.errorToast('Error: No se ha podido guardar la foto. ' + err.message);
        this.spinnerServ.hideLoadingSpinner();
      })

    this.events.subscribe('urlFotoGuardada', url => {
      this.spinnerServ.hideLoadingSpinner();
      if (!this.urlsFoto.includes(url)) {
        this.urlsFoto.push(url);
      }
      if (this.urlsFoto.length == 3) {
        this.fotosCargadas = true;
      }
    });
  }

  scanQR() {
    const options = { prompt: 'Escaneé el codigo de producto', format: "QR_CODE" };
    this.barcodeScanner.scan(options)
      .then(barcodeData => {
        if (barcodeData != "") {
          console.info("qr data", barcodeData.text)
          var dataSlpit = barcodeData.text.split("@");
          this.altaProdForm.controls['nombre'].setValue(dataSlpit[0]);
          this.altaProdForm.controls['descripcion'].setValue(dataSlpit[1]);
          this.altaProdForm.controls['tiempo'].setValue(dataSlpit[2]);
          this.altaProdForm.controls['precio'].setValue(dataSlpit[3]);
          console.info("form", this.altaProdForm.value)
        }
      })
      .catch(err => {
        console.error(err.message);
        this.toastServ.errorToast(`Error al scanear: ${err.message}`);
      })
  }

  altaProd() {
    
    this.spinnerServ.showLoadingSpinner();
    const producto = {
      nombre: this.altaProdForm.value.nombre,
      descripcion: this.altaProdForm.value.descripcion,
      tiempo: this.altaProdForm.value.tiempo,
      precio: this.altaProdForm.value.precio,
      idUsuario: this.usuario.id,
      fotos: this.urlsFoto
    }
    this.prodServ.saveProduct(producto)
      .then(res => {
        this.toastServ.confirmationToast("Alta realizada");
        this.spinnerServ.hideLoadingSpinner();
      })
      .catch(err => {
        this.spinnerServ.hideLoadingSpinner();
        this.toastServ.errorToast("Error al intentar dar de alta" + err);
        console.error(err)
      })
  }

}
