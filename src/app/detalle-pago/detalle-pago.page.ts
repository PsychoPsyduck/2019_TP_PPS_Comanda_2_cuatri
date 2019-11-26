import { Component, OnInit, Input } from '@angular/core';
import { Producto } from '../clases/producto';
import { NavParams, NavController } from '@ionic/angular';
import { PedidoService } from '../servicios/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../servicios/spinner.service';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.page.html',
  styleUrls: ['./detalle-pago.page.scss'],

 
})


export class DetallePagoPage implements OnInit {

key;
usuario;
pedido;
total:number=0;
propina=0;

  constructor(private spinner:SpinnerService, public router: Router,private route: ActivatedRoute, private pedidoServ: PedidoService, private navCtrl: NavController ) {

  this.TraerPedido();
   }

   Pagar(key)
   {

    this.spinner.showLoadingSpinner();

    this.pedidoServ.ModificarPorCliente(this.pedido,'pagado',key).then(()=>{
      setTimeout(() => {
        this.navCtrl.navigateRoot('/home');
        this.spinner.hideLoadingSpinner();
      }, 2000);
     
    })
   }



   TraerPedido()
   {
    this.pedidoServ.TraerPedidoPorCliente(JSON.parse(sessionStorage.getItem("usuario")).id).subscribe((data)=>{
      this.pedido=data[0].payload.doc.data();
      this.key=data[0].payload.doc.id;
     
      console.log("propina: "+this.propina)
      this.pedido.productoPedido.forEach((producto) => {
 
        this.total += parseInt(producto.precio);
        console.log(this.total);
        
      });
      
      console.log(this.pedido);
    });
   }

  ngOnInit() {


  }
  

}
