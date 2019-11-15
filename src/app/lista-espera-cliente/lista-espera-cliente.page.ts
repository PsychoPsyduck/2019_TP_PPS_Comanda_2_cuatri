import { Component, OnInit } from '@angular/core';
import { BarcodeService } from '../servicios/barcode.service';
import { Usuario } from '../clases/Usuario';
import { UsuariosService } from '../servicios/usuarios.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastService } from '../servicios/toast.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-espera-cliente',
  templateUrl: './lista-espera-cliente.page.html',
  styleUrls: ['./lista-espera-cliente.page.scss'],
})
export class ListaEsperaClientePage implements OnInit {

  usuario: Usuario;
  mensaje;
  enLista: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    private navCtrl: NavController,
    private barcode: BarcodeScanner,
    private usrServ: UsuariosService,
    private toast: ToastService) {
    //this.usuario=JSON.parse(sessionStorage.getItem("usuario"));
    //console.log(this.usuario);
    this.verificar();
  }

  async traerUsuario() {
    this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
  }

  async verificar() {

    this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
    await this.usrServ.TraerListaEsperaMesa().then(async (data) => {
      await data.forEach((registro) => {
        registro.forEach(element => {
          console.log("ele", element)
          if (element.correo == this.usuario.correo) {
            console.log("esta en la lista");
            this.enLista = true;
            this.navCtrl.navigateRoot('/principal-cliente').then(() => {
              this.toast.confirmationToast("Ya estas en la lista de espera.");
            })
          }
        });
        if (!this.enLista) {
          this.Scan();
        }
      });
    })
  }

  async Scan() {

    this.barcode.scan({ prompt: "Scanee el código QR para agregarse a la lista de espera" }).then(barcodeData => {
      this.mensaje = barcodeData.text;
      if (barcodeData.text == 'laComanda') {

        this.usrServ.AgregarListaEsperaMesa(this.usuario).then(() => {
          this.toast.confirmationToast("Te agregaste a la lista.");
          this.navCtrl.navigateRoot('/principal-cliente');
        })
      }
    }).catch(err => {
      console.log('Error', err);
    })
  }

  ngOnInit() {
  }

}
