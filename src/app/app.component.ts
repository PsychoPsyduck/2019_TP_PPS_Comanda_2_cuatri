import { Component } from '@angular/core';
import { MenuController, Events } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { SpinnerService } from './servicios/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public pages = [];
  noLogin: boolean = false;

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
    this.noLogin = false;
    this.events.subscribe('usuarioLogueado', data => {
      // SUSCRIPCIONs
      console.log('perfil recibidos:', data);
      this.noLogin = true;
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
        // SUPERVISOR - DUEÑO
        case 'supervisor':
        case 'dueño':
          console.log("sos el dueño");
          this.pages.push(
            // (A) ALTA DUEÑO
            {
              title: 'Lista usuarios pendientes',
              url: '/lista-usuarios-pendientes',
              icon: 'people'
            },
            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-dueno',
              icon: 'key'
            }
          );
          break;

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
            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-dueno',
              icon: 'key'
            },
            {
              title: 'Alta de Platos y Bebidas',
              url: '/alta-prod',
              icon: 'key'
            }
          );
          break;

        case 'bartender':
        case 'cocinero':
          this.pages.push(
            {
              title: 'Alta de Platos y Bebidas',
              url: '/alta-prod',
              icon: 'key'
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
    this.router.navigateByUrl(pagina);
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
