import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../servicios/pedido.service';
import { Pedido } from '../clases/pedido';
import {diccionario} from "../clases/diccionario";
import { ToastService } from '../servicios/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { DetallePagoPage } from '../detalle-pago/detalle-pago.page';
import { CuentaComponent } from '../componentes/cuenta/cuenta.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-pedido-del-cliente',
  templateUrl: './pedido-del-cliente.page.html',
  styleUrls: ['./pedido-del-cliente.page.scss'],
})
export class PedidoDelClientePage implements OnInit {

 pedido:Pedido;
 pedidoSubs: Subscription;
 total;
 estados = diccionario.estados_pedidos;
 encuensta:boolean;
entrega=0;
entregatxt;
key;
  constructor(private modalctrl: ModalController ,private pedidos: PedidoService, private toast: ToastService, private navCtrl: NavController) {

    
   }

  TraerPedido()
  {
   this.pedidoSubs= this.pedidos.TraerPedidoPorCliente(JSON.parse(sessionStorage.getItem("usuario")).id).subscribe((data)=>{
      this.pedido=data[0].payload.doc.data();
      this.key=data[0].payload.doc.id;
      this.total=0;
      this.pedido.productoPedido.forEach((p)=>{
        this.total= this.total + p.precio;
        console.log(p.entrega)

        let fecha =p.entrega.split(" "); 
        let horaYMinuto= fecha[1].split(":");
        let hora = horaYMinuto[0];
        let min = horaYMinuto[1];

        if(hora > this.entrega)
        {
          this.entrega=hora;
          this.entregatxt= hora + ":" + min; 
        }
       
      })

      if(this.pedido.estado != this.estados.solicitado)
      {
        this.encuensta=true;
      }
      else{
        this.encuensta=false;
      }
      this.modalctrl.create({
        component: CuentaComponent,
        componentProps: {pedido: this.pedido}
      });
    })
  }

  ModificarEstadoPedido(estado)
  {
    this.pedidos.ModificarPorCliente(this.pedido,estado,this.key).then(()=>{
      this.toast.confirmationToast("se modifico el estado del pedido");
    })
    .catch(()=>{
      this.toast.errorToast("no se pudo modificar el estado");
    })
  }

  SolicitarCuenta()
  {
    this.pedidos.ModificarPorCliente(this.pedido, this.estados.cuenta, this.key).then(()=>{
      
      this.pedidoSubs.unsubscribe();

      this.navCtrl.navigateRoot('detalle-pago');
    })
  }


  ngOnInit() {
    this.TraerPedido();
  }

  ionViewWillUnload()
  {
    this.pedidoSubs.unsubscribe();
  }

  

}
