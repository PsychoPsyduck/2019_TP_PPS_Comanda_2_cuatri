import { Component, OnInit } from '@angular/core';
import { BarcodeService } from '../servicios/barcode.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';

@Component({
  selector: 'app-lista-espera-mesa',
  templateUrl: './lista-espera-mesa.page.html',
  styleUrls: ['./lista-espera-mesa.page.scss'],
})
export class ListaEsperaMesaPage implements OnInit {

usuario:Usuario;
listaEspera;

  constructor( private usrServ: UsuariosService) {

    this.TraerLista();

   }

TraerLista()
{
  this.usrServ.TraerListaEsperaMesa().then((data)=>{
   data.forEach(reg=>{
    this.listaEspera=reg;
   })
    console.log(this.listaEspera)
  }).catch((data)=>{
    console.log(data)
  })
}

  ngOnInit() {
  }

}
