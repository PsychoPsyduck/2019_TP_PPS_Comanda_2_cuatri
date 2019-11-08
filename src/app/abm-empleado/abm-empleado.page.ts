import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { BarcodeScannerOptions, BarcodeScanResult, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { EmpleadosService } from '../servicios/empleados.service';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-abm-empleado',
  templateUrl: './abm-empleado.page.html',
  styleUrls: ['./abm-empleado.page.scss'],
})
export class AbmEmpleadoPage implements OnInit {
  @ViewChild('fileInput', null) public fileInput;
  public puedeGuardar = false;
  public form: FormGroup;
  public errorClaves;

  constructor(
    public formBuilder: FormBuilder,
    public camera: Camera,
    public barcodeScanner: BarcodeScanner,
    private empleadoServ: EmpleadosService,
    private toastServ: ToastService
  ) {
    // console.log('Constructor de AltaEmpleado');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      foto: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      cuil: ['', Validators.required],
      perfil: ['', Validators.required],
      correo: ['', Validators.compose([Validators.required, Validators.email])],
      clave: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      claveConfirmada: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.form.controls.claveConfirmada.valueChanges.subscribe(() => {
      this.errorClaves = this.ValidarContrasenas();
    });

    // Observar cambios del form
    this.form.valueChanges.subscribe((value) => {
      // console.log(this.form.valid);
      this.puedeGuardar = this.form.valid;
    });
  }

  public getPicture() {
    if (Camera.installed()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ foto: data });
      }, (err) => {
        if (err === 'No Image Selected') {
          console.log('Cancelado.');
        } else {
          console.log('Error al tomar la foto ' + err);
        }
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  public processWebImage(event) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageData = (readerEvent.target as any).result;
      this.form.patchValue({ foto: imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  public getProfileImageStyle() {
    return 'url(' + this.form.controls.foto.value + ')';
  }

  public ValidarContrasenas() {
    if (this.form.controls.clave.value !== this.form.controls.claveConfirmada.value) {
      console.log('Error en las claves');
      return true;
    }

    return false;
  }
  
  public escanearDni() {
    const options: BarcodeScannerOptions = { prompt: 'Escaneá el DNI', formats: 'PDF_417' };
    this.barcodeScanner.scan(options).then((barcodeData: BarcodeScanResult) => {
      const scan = (barcodeData.text).split('@');
      this.form.controls.apellido.setValue(scan[1]);
      this.form.controls.nombre.setValue(scan[2]);
      this.form.controls.dni.setValue(scan[4]);
    }, (error) => {
      console.log(error);
      // this.messageHandler.mostrarErrorLiteral(error);
    });
  }
  
  public async AgregarEmpleado() {
    if (!this.form.valid || this.ValidarContrasenas()) {
      this.form.patchValue({ claveConfirmada: '' });
      return;
    }

    this.form.removeControl('claveConfirmada');
    
    if (this.form.value !== undefined) {
      this.empleadoServ.AgregarEmpleado(this.form.value).then(() => {
        this.toastServ.confirmationToast("Empleado cargado correctamente");
      }).catch(() => {
        this.toastServ.errorToast("El empleado no se pudo cargar. Intente en unos minutos.");
      })
    }
  }
}
