import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CamaraService } from '../servicios/camara.service';
import { BarcodeService } from '../servicios/barcode.service';
import { ToastService } from '../servicios/toast.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { Events } from '@ionic/angular';
import { SpinnerService } from '../servicios/spinner.service';


@Component({
  selector: 'app-abm-dueno',
  templateUrl: './abm-dueno.page.html',
  styleUrls: ['./abm-dueno.page.scss'],
})
export class AbmDuenoPage implements OnInit {

  altaDuenoForm: FormGroup;
  foto: any = null;
  urlFoto: string;
  fotoGuardada: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private camServ: CamaraService,
    private barcodeServ: BarcodeService,
    private toastServ: ToastService,
    private userServ: UsuariosService,
    public events: Events,
    public spinnerServ: SpinnerService) {
  }

  ngOnInit() {
    this.altaDuenoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      apellido: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$")]],
      dni: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      cuil: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
      perfil: ['', Validators.required]
    });
  }

  setPerfil(perfil) {
    this.altaDuenoForm.controls['perfil'].setValue(perfil);
  }

  takeFoto() {
    this.camServ.takePhoto()
      .then(imgData => {
        if (imgData !== 'No Image Selected') {
          this.saveFoto(imgData);
          this.foto = `data:image/jpeg;base64,${imgData}`;
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
        // this.toastServ.confirmationToast("Foto guardada")
      })
      .catch(err => {
        this.toastServ.errorToast('Error: No se ha podido guardar la foto. ' + err.message);
        this.spinnerServ.hideLoadingSpinner();
      })

    this.events.subscribe('urlFotoGuardada', url => {
      this.spinnerServ.hideLoadingSpinner();
      this.urlFoto = url;
      this.fotoGuardada = true;
    });
  }

  scanDNI() {
    const options = { prompt: 'Escaneé su DNI', format: "PDF_417" };
    this.barcodeServ.scan(options)
      .then(barcodeData => {
        if (barcodeData != "") {
          var dataSlpit = barcodeData.text.split("@");
          this.altaDuenoForm.controls['apellido'].setValue(dataSlpit[1]);
          this.altaDuenoForm.controls['nombre'].setValue(dataSlpit[2]);
          this.altaDuenoForm.controls['dni'].setValue(dataSlpit[4]);
        }
      })
      .catch(err => {
        console.error(err.message);
        this.toastServ.errorToast(`Error al scanear: ${err.message}`);
      })
  }

  altaDueno() {
    this.spinnerServ.showLoadingSpinner();
    const usuario = {
      nombre : this.altaDuenoForm.value.nombre,
      apellido : this.altaDuenoForm.value.apellido,
      dni : this.altaDuenoForm.value.dni,
      cuil : this.altaDuenoForm.value.cuil,
      correo : this.altaDuenoForm.value.correo,
      clave : this.altaDuenoForm.value.clave,
      tipo : this.altaDuenoForm.value.perfil,
      foto : this.urlFoto
    }
    this.userServ.saveUsuario(usuario)
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

// Se cargarán: nombre, apellido, DNI, CUIL, foto y perfil.
// La foto se tomará del celular.
// Brindar la posibilidad de contar con un lector de código QR para el DNI, que cargará la información disponible (sólo aplicable a aquellos documentos que lo posean).
// Esta acción la podrá realizar el supervisor o el dueño.
