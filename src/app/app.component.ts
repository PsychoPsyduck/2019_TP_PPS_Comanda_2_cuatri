import { Component } from '@angular/core';
import { MenuController, Events } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { SpinnerService } from './servicios/spinner.service';
import { Usuario } from './clases/Usuario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public pages = [];
  logeado: boolean = false;
  usuario: Usuario = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    public events: Events,
    private router: Router,
    public spinnerServ: SpinnerService
  ) {
    this.initializeApp();

    this.logeado = false;
    this.events.subscribe('usuarioLogueado', data => {

      this.menu.enable(true);
      this.logeado = true;

      this.pages = [];
      this.pages.push(
        {
          title: 'Home',
          url: '/home',
          icon: 'home'
        },
        {
          title: 'Cerrar Sesion',
          url: '/login',
          icon: 'log-out'
        }
      )

      // ROUTING DEL MENU
      switch (data.tipo) {

        // **************  SUPERVISOR - DUEÑO ****************/
        case 'supervisor':
        case 'dueño':
          console.log("sos el dueño");
          this.pages.push(

            {
              title: 'Lista usuarios pendientes',
              url: '/lista-usuarios-pendientes',
              icon: 'people'
            },

            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-dueno',
              icon: 'add'
            },
            {
              title: 'Lista de espera',
              url: '/lista-espera-mesa',
              icon: 'people'
            },
          );
          break;

        // **************  CLIENTE ****************/
        case 'cliente':

          this.pages.push(

            {
              title: 'Poner en lista de espera',
              url: '/lista-espera-cliente',
              icon: 'people',

            },
            {
              title: 'Pedir',
              url: '/principal-cliente',
              icon: 'bonfire'
            },
          );
          break;

        //************** MOZOS ****************/
        case 'mozo':
          this.pages.push(

            {
              title: 'Lista de espera',
              url: '/lista-espera-mesa',
              icon: 'people'
            },
            {
              title: 'Pedir',
              url: '/alta-pedido',
              icon: 'bonfire'
            },
          );
          break;

        //************** EMPLEADOS ****************/
        case 'empleado':
          break;

        //************** ADMIN ****************/
        case 'admin':
          // (A) ALTA DUEÑO
          // (B) ALTA EMPLEADO
          // (C) ALTA PRODUCTO
          // (E) ALTA MESAS
          // (J) ENCUESTA EMPLEADO
          // (I - J - K) GRAFICOS DE ENCUESTAS
          // (N) HACER RESERVAS AGENDADAS (opcional - supervisor)
          // (Q) NPUSH - HACER RESERVA / DELIVERY (VA PARA EL MOZO / DELIVERY)
          // this.fcm.subscribeToTopic('notificacionReservas');
          this.pages.push(
            {
              title: 'Lista usuarios pendientes',
              url: '/lista-usuarios-pendientes',
              icon: 'people'
            },
            // ----------- ALTAS ---------------
            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-dueno',
              icon: 'add'
            },
            {
              title: 'Alta de Platos y Bebidas',
              url: '/alta-prod',
              icon: 'add'
            },
            // (B) ALTA EMPLEADO
            {
              title: 'Alta Empleado',
              url: '/abm-empleado',
              icon: 'add'
            },
            // (E) ALTA MESAS
            {
              title: 'Alta Mesa',
              url: '/abm-mesa',
              icon: 'add'
            },
            // --------- PEDIDOS -----------
            {
              title: 'Pedir',
              url: '/principal-cliente',
              icon: 'bonfire'
            },
            {
              title: 'Lista de pedidos',
              url: '/lista-pedidos-productos',
              icon: 'list-box'
            },
            //----------- RESERVAS - ESPERA DE MESAS ---------------
            {
              title: 'Lista de espera',
              url: '/lista-espera-mesa',
              icon: 'people'
            },
          );
          break;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  navegoPagina(pagina) {
    if (pagina === '/login') {
      this.menu.enable(false);
      sessionStorage.removeItem("usuario");
    }
    this.router.navigate([pagina]);
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
