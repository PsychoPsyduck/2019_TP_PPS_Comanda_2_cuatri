import { Component } from '@angular/core';
import { MenuController, Events } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { SpinnerService } from './servicios/spinner.service';
import { Usuario } from './clases/Usuario';
import { PushNotificationService } from './servicios/push-notification.service';

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
    public spinnerServ: SpinnerService,
    private notifServ: PushNotificationService
  ) {

    this.initializeApp();

    this.logeado = false;
    this.events.subscribe('usuarioLogueado', data => {
      this.usuario = data;

      this.menu.enable(true);
      this.logeado = true;

      this.pages = [];
      this.pages.push(
        {
          title: 'Home',
          url: '/home',
          icon: 'home'
        },
        // {
        //   title: 'Cerrar Sesion',
        //   url: '/login',
        //   icon: 'log-out'
        // }
      )

      // ROUTING DEL MENU
      switch (data.tipo) {
        // **************  SUPERVISOR - DUEÑO ****************/
        case 'dueño':
        case 'supervisor':
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
              icon: 'key'
            },
            {
              title: 'Reservas pendientes',
              url: '/reservas-pendientes',
              icon: 'time'
            },
            {
              title: 'Lista de espera',
              url: '/lista-espera-mesa',
              icon: 'people'
            }
          );
          break;

        // **************  CLIENTE ****************/

        case 'anonimo':
          this.pages.push(

            {
              title: 'Poner en lista de espera',
              url: '/lista-espera-cliente',
              icon: 'people',

            },
            {
              title: 'Leer QR mesa',
              url: '/scan-mesa',
              icon: 'contract'
            }

          );
          break;

        case 'cliente':

          this.pages.push(

            {
              title: 'Poner en lista de espera',
              url: '/lista-espera-cliente',
              icon: 'people',

            },
            {
              title: 'Reservar mesa',
              url: '/reservar-mesa',
              icon: 'time',

            },
            {
              title: 'Leer QR mesa',
              url: '/scan-mesa',
              icon: 'contract'
            }

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
              title: 'Lista de pedidos',
              url: '/lista-pedidos',
              icon: 'list-box'
            },
          );
          break;

        //************** EMPLEADOS ****************/
        case 'empleado':
          this.pages.push(
            {
              title: 'Pedidos pendientes',
              url: '/lista-pedidos-productos',
              icon: 'list-box'
            },
            {
              title: 'Alta de Platos y Bebidas',
              url: '/alta-prod',
              icon: 'add'
            }
          );
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
              title: 'Leer QR mesa',
              url: '/scan-mesa',
              icon: 'contract'
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
            }
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

  cerrarSesion() {
    if (this.usuario != null) {
      this.notifServ.desuscribirseATopico(this.usuario.tipo)
      this.menu.enable(false);
      sessionStorage.removeItem("usuario");
    }
  }
}
