import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { Mesa } from '../clases/mesa';
import { QrService } from '../servicios/qr.service';
import { MesasService } from '../servicios/mesas.service';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-abm-mesa',
  templateUrl: './abm-mesa.page.html',
  styleUrls: ['./abm-mesa.page.scss'],
})
export class AbmMesaPage implements OnInit {
  @ViewChild('fileInput', null) public fileInput;
  public puedeGuardar = false;
  public form: FormGroup;
  public createdCode: any;

  constructor(
    /* public navCtrl: NavController,
    public viewCtrl: ViewController, */
    public formBuilder: FormBuilder,
    public camera: Camera,
    public qrServ: QrService,
    private mesasServ: MesasService,
    private toastServ: ToastService
  ) {
    // console.log('Constructor de AltaMesaPage');
  }

  ngOnInit() {
    // console.log(this.navParams.data.mesa);

    this.form = this.formBuilder.group({
      foto: ['', Validators.required],
      id: ['', Validators.required],
      comensales: ['', Validators.required],
      tipo: ['', Validators.required]
    });

    // Observar cambios del form
    this.form.valueChanges.subscribe((value) => {
      // console.log(this.form.valid);
      this.puedeGuardar = this.form.valid;
      this.createdCode = this.qrServ.createCode('Mesa:' + this.form.controls.id.value.toString());
    });

    // if (this.navParams.data.mesa) {
    //   const mesaData: Mesa = this.navParams.data.mesa;
    //   this.form.patchValue({
    //     foto: mesaData.foto,
    //     id: mesaData.id,
    //     comensales: mesaData.comensales,
    //     tipo: mesaData.tipo
    //   });
    //   this.getProfileImageStyle();
    // }
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

  AgregarMesa() {
    if (!this.form.valid) { return; }

    this.mesasServ.AgregarMesa(this.form.value).then(() => {
      this.toastServ.confirmationToast("Mesa cargada correctamente");
    }).catch(() => {
      this.toastServ.errorToast("La mesa no se pudo cargar. Intente en unos minutos.");
    })
  }
}
