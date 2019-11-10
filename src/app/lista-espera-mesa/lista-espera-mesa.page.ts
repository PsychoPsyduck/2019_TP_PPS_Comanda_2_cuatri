import { Component, OnInit } from '@angular/core';
import { BarcodeService } from '../servicios/barcode.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-espera-mesa',
  templateUrl: './lista-espera-mesa.page.html',
  styleUrls: ['./lista-espera-mesa.page.scss'],
})
export class ListaEsperaMesaPage implements OnInit {

  usuario: Usuario;
  listaEspera;

  constructor(
    private router: Router,
    private usrServ: UsuariosService, 
    private barcode: BarcodeScanner) {

    this.TraerLista();

  }

  TraerLista() {
    this.usrServ.TraerListaEsperaMesa().then((data) => {
      data.forEach(reg => {
        this.listaEspera = reg;
      })
      console.log(this.listaEspera)
    }).catch((data) => {
      console.log(data)
    })
  }

  asignarMesa(usuario) {
    const options = { prompt: 'Escaneá el código QR de la mesa' };
    this.barcode.scan(options)
      .then(barcodeData => {
        const auxMesa = barcodeData.text;
        this.router.navigate(['reservar-mesa', { mesa: auxMesa, reserva: JSON.stringify(usuario), tipo: 'esperaMesa' }]);
      }, (err) => {
        // // datos hardcodeados para testear
        // const auxMesa = 'mesa02';
        // this.router.navigate(['reservar-mesa', { mesa: auxMesa, reserva: JSON.stringify(reserva) }]);
        // this.messageHandlerServ.mostrarError(err, 'Ocurrió un error');
      });
  }

  cancelarEspera(usuario){

  }

  ngOnInit() {
  }

}
