import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UsuariosService } from '../servicios/usuarios.service';
import { ToastService } from '../servicios/toast.service';
import { MesasService } from '../servicios/mesas.service';
import { Mesa } from '../clases/mesa';
import { Usuario } from '../clases/Usuario';
import { ReservasService } from '../servicios/reservas.service';
import { Reserva } from '../clases/Reserva';
import { RegistroEspera } from '../clases/RegistroEspera';
import { PedidoService } from '../servicios/pedido.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-scan-mesa',
  templateUrl: './scan-mesa.page.html',
  styleUrls: ['./scan-mesa.page.scss'],
})
export class ScanMesaPage implements OnInit {

  esperaSubs:Subscription;
  mesaSubs:Subscription;
  reservaSubs:Subscription;
  reservaSubs2:Subscription;
  pedidoSubs:Subscription;
  usrConReserva=false;
  mesaReservada=false;
  listaEsperas: Array<RegistroEspera>;
  listaMesas: Array<any>;
  listaRservas: Array<Reserva>;
  listaPedidos;
  estaEnLista=false;
  usuarioHabilitado=false;
  mesaHabilitada=true;
  sinReserva=true;
  tienePedido;
  estadoPedido:string;
  mesa:Mesa;
  usuario: Usuario;
  tokenPrueba:string= "YSNbdwHp6lTojjnM3xDS";

  constructor(private navCtrl: NavController, 
    private barcode: BarcodeScanner, 
    private usrServ: UsuariosService, 
    private toast: ToastService, 
    private mesaServ: MesasService,
    private reservas: ReservasService,
  private pedidoServ: PedidoService) 
    {
   
      
      this.Scan();
    
     }


async Scan()
    {
      var keyMesa;
      this.barcode.scan().then( async barcodeData => {
         keyMesa = barcodeData.text;
        //keyMesa= "fzMeTAWWdVzLR7yG7sNp";

      var usuario=JSON.parse(sessionStorage.getItem("usuario"))
      this.esperaSubs= await this.usrServ.TraerEsperasObservable().subscribe(  (data)=>{
        this.listaEsperas=data;
         this.listaEsperas.forEach((espera: RegistroEspera) => {

          if(espera.idUsuario == usuario.id && espera.estado =="aceptado")
          {
            this.usuarioHabilitado=true;
            //console.log("usuario habilitado")
          }
          if(espera.idUsuario==usuario.id && espera.estado=='pendiente')
          {
            this.estaEnLista=true;
            this.toast.errorToast("No estas aceptado");
            this.Navegar('/home');
          }
        })
        if(this.usuarioHabilitado == false && this.estaEnLista == false)
        { 
          this.reservaSubs=  this.reservas.TraerReservas().subscribe( (dataReservas)=>{
            dataReservas.forEach((reserva: Reserva) => {
            if(reserva.mesa==keyMesa && reserva.estado != "pendiente" &&
            ((Date.now() / 1000) /60) <= ((Date.parse(reserva.fecha)/1000)/60) && 
            ((Date.now() / 1000) /60) >= (((Date.parse(reserva.fecha)/1000)/60) -40) &&
            reserva.usuario.id== usuario.id
            )
            {
              this.toast.confirmationToast("podes tomar tu reserva");
              this.sinReserva = false; 
            }
          });

          if(this.sinReserva==true)
          {
            this.toast.errorToast("a la lista");
            this.Navegar('/home');
          }
        })
          
      }

          if(this.usuarioHabilitado)
          {
            
          this.mesaSubs=  this.mesaServ.ObtenerMesas().subscribe((data_mesas)=>{
              this.listaMesas=data_mesas;
              
              this.listaMesas.forEach( async (mesa)=>{
                console.log(mesa.key, keyMesa)
                if(mesa.key==keyMesa)
                {
                  
                  if(mesa.estado == 'ocupada')
                  {
                    console.log("mesa ocupada")
                  
                  if(mesa.ocupante==usuario.id)
                  {
                   
                   this.pedidoSubs=  this.pedidoServ.PedidosObservable().subscribe((data_pedidos)=>{
                      this.listaPedidos= data_pedidos;
                      console.log(this.listaPedidos)
                      this.listaPedidos.forEach(pedido => {
                        
                        if(pedido.cliente == usuario.id)
                        { 
                          this.tienePedido=true;
                          this.estadoPedido=pedido.estado;
                        }
                      });

                      if(this.tienePedido)
                      {

                        if(this.estadoPedido=='aceptado')
                        {
                          this.toast.confirmationToast("Podes llenar la encuesta");
                          this.Navegar('/encuesta-cliente')
                        }
                        else{
                          this.toast.errorToast("Una vez aceptado el pedido podras hacer la encuesta.")
                          
                          this.Navegar('/home');
                        }

                      }
                      else{
                        console.log("hacer pedido")
                        this.Navegar('/alta-pedido')
                      }

                    })
                  }
                  else{
                    this.mesaHabilitada=false;
                    this.toast.errorToast("mesa ocupada");
                    this.Navegar('/home')
                  }
                }

                if(mesa.estado=='libre')
                {
                  this.reservaSubs2= await this.reservas.TraerReservas().subscribe( async (data_res)=>{
                   
                    this.listaRservas=data_res;
                    
                     await this.listaRservas.forEach((r)=>{

                      let ahora=((Date.now() / 1000) /60);
                      let ahoraMas=((Date.now() / 1000) /60)+10;
                      let minRsereva= ((Date.parse(r.fecha)/1000)/60 );
                      let minLimite = ((Date.parse(r.fecha)/1000)/60) -40;
   
                       if(r.mesa==keyMesa && r.estado == "aceptada" && ahora >= minLimite)
                      { 
                        if(r.usuario.id == usuario.id)
                        {
                          this.usrConReserva=true;
                          this.toast.confirmationToast("Ocupaste la mesa que tenias reservada");
                          
                          this.mesaServ.Ocupar(mesa, usuario).then(()=>{
                            this.Navegar('/alta-pedido');
                          });
                        }
                        else
                        {
                          this.mesaReservada=true;  
                        }
                                              
                      }
                    })
                    if(this.mesaReservada ==false && this.usrConReserva==false)
                    {
                      this.toast.confirmationToast("Ocupaste la mesa");
                      this.mesaServ.Ocupar(mesa, usuario).then(()=>{
                        this.Navegar('/alta-pedido');
                      })
                    }
                    if(this.mesaReservada==true)
                    {
                      this.toast.errorToast("Mesa reservada");
                      this.Navegar('/home');
                    }
                  })

 
                }
                }
              })
            })
          }


      });
      


   }).catch(err => {
      console.log('Error', err);
    })
      
    }

    Navegar(path:string)
    {
      this.navCtrl.navigateRoot(path).then(()=>{
        this.esperaSubs.unsubscribe();
        this.mesaSubs.unsubscribe();
        this.reservaSubs.unsubscribe();
        this.pedidoSubs.unsubscribe();
        this.reservaSubs2.unsubscribe();
      })
    }
/*
    validarRserva(reserva, mesa)
    {
      let ahora=((Date.now() / 1000) /60);
      let ahoraMas=((Date.now() / 1000) /60)+10;
      let minRsereva= ((Date.parse(reserva.fecha)/1000)/60 );
      let minLimite = ((Date.parse(reserva.fecha)/1000)/60) -40;
      let reservada: boolean;

      if(reserva.mesa==mesa && reserva.estado == "aceptada" &&
      ahora <= minRsereva && 
      ahora >= minLimite)


    }*/
      
  ngOnInit() {

  }



}
