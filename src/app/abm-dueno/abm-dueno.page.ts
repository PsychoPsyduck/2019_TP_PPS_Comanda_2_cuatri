import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CamaraService } from '../servicios/camara.service';
import { BarcodeService } from '../servicios/barcode.service';
import { ToastService } from '../servicios/toast.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';
import { Events } from '@ionic/angular';


@Component({
  selector: 'app-abm-dueno',
  templateUrl: './abm-dueno.page.html',
  styleUrls: ['./abm-dueno.page.scss'],
})
export class AbmDuenoPage implements OnInit {

  altaDuenoForm: FormGroup;
  foto: any = null;
  urlFoto: string;

  constructor(
    private formBuilder: FormBuilder,
    private camServ: CamaraService,
    private barcodeServ: BarcodeService,
    private toastServ: ToastService,
    private userServ: UsuariosService,
    public events: Events) {
  }

  ngOnInit() {
    this.altaDuenoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      cuil: ['', Validators.required],
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
        } else {
          this.toastServ.errorToast("No se pudo tomar la foto");
        }
      })
      .catch(error => {
        this.toastServ.errorToast(`Error al tomar foto: ${error.message}`);
      })
  }

  saveFoto(data: any) {
    var res = this.camServ.uploadPhoto(data)
      .then((res) => {

        this.toastServ.confirmationToast("Foto guardada")
      })
      .catch(err => {
        this.toastServ.errorToast('Error: No se ha podido guardar la foto. ' + err.message);
      })
    this.events.subscribe('urlFotoGuardada', url => {
      console.info("evento url", url);
      this.urlFoto = url;
    });
  }

  scanDNI() {
    this.barcodeServ.scan()
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

    console.warn(this.altaDuenoForm.value);

    const usuario = new Usuario();
    usuario.nombre = this.altaDuenoForm.value.nombre;
    usuario.apellido = this.altaDuenoForm.value.apellido;
    usuario.dni = this.altaDuenoForm.value.dni;
    usuario.cuil = this.altaDuenoForm.value.cuil;
    usuario.correo = this.altaDuenoForm.value.correo;
    usuario.clave = this.altaDuenoForm.value.clave;
    usuario.tipo = this.altaDuenoForm.value.perfil;
    usuario.foto = this.urlFoto;

    this.userServ.saveUsuario(usuario)
      .then(res => {
        console.info("save user res", res)
      })
      .catch(err => {
        console.error(err)
      })
  }

}

// Se cargarán: nombre, apellido, DNI, CUIL, foto y perfil.
// La foto se tomará del celular.
// Brindar la posibilidad de contar con un lector de código QR para el DNI, que cargará la información disponible (sólo aplicable a aquellos documentos que lo posean).
// Esta acción la podrá realizar el supervisor o el dueño.
