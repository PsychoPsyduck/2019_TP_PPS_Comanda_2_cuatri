import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../servicios/reservas.service';
import { Usuario } from '../clases/Usuario';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Reserva } from '../clases/Reserva';
import { MesasService } from '../servicios/mesas.service';
import { Mesa } from '../clases/Mesa';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-reservar-mesa',
  templateUrl: './reservar-mesa.page.html',
  styleUrls: ['./reservar-mesa.page.scss'],
})
export class ReservarMesaPage implements OnInit {
  usuario:Usuario;
  listaReservas: Array<Reserva>;
  listaMesas: Array<Mesa>;
  hoy;
  t:Date

  constructor(private builder: FormBuilder, 
    private reservaServ: ReservasService,
    private mesaServ: MesasService,
  private toast: ToastService) 
    {
        this.t=new Date();

         if(this.t.getDate() < 10)
         {
          this.hoy= this.t.getFullYear() + "-" + (this.t.getMonth()+1) + "-" +"0"+ this.t.getDate();
         }
         else{
          this.hoy= this.t.getFullYear() + "-" + (this.t.getMonth()+1) + "-" + this.t.getDate();
         }
      
          this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
    
          this.TraerReservas();
         this.TraerMesas();
   }

   
fecha = new FormControl('', [
  Validators.required
]);


cant_comensales = new FormControl('', [
  Validators.required,
]);

vip = new FormControl('', [
  
]);


registroForm: FormGroup = this.builder.group({
  fecha: this.fecha,
  cant_comensales: this.cant_comensales,
  vip: this.vip,

  
});

TraerMesas()
{
  this.mesaServ.ObtenerMesas().subscribe((data)=>{
    this.listaMesas=data.map(function(mesa){
      return mesa;
    })
    console.log(this.listaMesas);
  })
}

  TraerReservas()
  {
    this.reservaServ.TraerReservas().subscribe((data)=>{
      this.listaReservas = data;
    })
  }

 async GuardarReserva()
  {
    let reserva= new Reserva();
    let f= new Date(this.registroForm.get('fecha').value);
    let dia= f.getDate(), mes=f.getMonth()+1, hora=f.getHours(), minuto=f.getMinutes();
    let diastr, messtr, horastr, minutostr;
    dia <10 ? diastr= "0"+dia.toString() : diastr=dia;
    mes <10 ? messtr= "0"+mes.toString() : messtr=mes;
    hora <10 ? horastr= "0"+hora.toString() : horastr=hora;
    minuto <10 ? minutostr= "0"+minuto.toString() : minutostr=minuto;
    reserva.fecha=  diastr +"-"+ messtr +"-"+ f.getFullYear() +" "+ horastr+":"+ minutostr;
  
    let minAReservar = (Date.parse(reserva.fecha) / 1000) / 60;
    console.log(minAReservar);
  
    
    reserva.usuario=this.usuario;
    reserva.estado="pendiente";
    reserva.comensales= this.registroForm.value.cant_comensales;
    let bandera:boolean= true;
    let libre:boolean;

  let mesasAdecuadas= this.listaMesas.filter((mesa)=>{
    return mesa.comensales == reserva.comensales;
  });

 mesasAdecuadas.forEach((m)=>
{
 if(this.validarMesa(minAReservar, m.key) && bandera)
 {
   bandera=false;
   libre=true;
   reserva.mesa = m.key;
   this.reservaServ.AgendarReserva(reserva).then(()=>{
    this.toast.confirmationToast("Mesa reservada para el " + reserva.fecha);
  });
 }
})
if(!libre)
{
  this.toast.errorToast("No hay mesas disponibles para esa fecha");
}
    
  }

validarMesa(fechaEnMin, mesa)
{
  let rta:boolean =true;

  this.listaReservas.forEach((reserva)=>{

    let minReservados = (Date.parse(reserva.fecha) / 1000) / 60;
console.log(minReservados);
    if(((minReservados - 40) <= fechaEnMin ) && ((minReservados + 40) >= fechaEnMin)
    && reserva.mesa == mesa)
    {
      rta=false;
    }
  })

  return rta;

}


  ngOnInit() {

    
    console.log(this.hoy);
  }

}
