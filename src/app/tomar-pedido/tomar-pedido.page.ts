import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModalController } from '@ionic/angular';
import { UsuariosService } from '../servicios/usuarios.service';


@Component({
  selector: 'app-tomar-pedido',
  templateUrl: './tomar-pedido.page.html',
  styleUrls: ['./tomar-pedido.page.scss'],
})
export class TomarPedidoPage implements OnInit {
  public mostrarSpinner: boolean = false;
  public puedeGuardar = false;
  public form: FormGroup;
  public pedido;
  usuario: any;
  constructor(
    public userServ: UsuariosService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.usuario = this.userServ.getUsuarioStorage();
    console.log(this.pedido);
    this.form = this.formBuilder.group({
      tiempoDeEspera: [
        "",
        Validators.compose([Validators.required, Validators.min(1)])
      ]
    });

    // Observar cambios del form
    this.form.valueChanges.subscribe(value => {
      // console.log(this.form.valid);
      this.puedeGuardar = this.form.valid;
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  done() {
    if (!this.form.valid) {
      return;
    }
    this.modalCtrl.dismiss(this.form.value);
  }
}
