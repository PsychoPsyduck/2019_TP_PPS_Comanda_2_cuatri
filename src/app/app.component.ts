import { Component } from '@angular/core';
import { MenuController, Events } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public pages = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    public events: Events,
    private router: Router
  ) {
    this.initializeApp();

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

    this.events.subscribe('usuarioLogueado', data => {
      console.log('event received');
      console.log('perfil recibidos:', data);

      // SUSCRIPCIONs
      console.log('perfil recibidos:', data);
      // ROUTING DEL MENU
      switch (data) {

        // console.log('Entro en Switch', data);

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
          });
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
            // (A) ALTA DUEÑO
            {
              title: 'Alta Dueño/Supervisor',
              url: '/abm-dueno',
              icon: 'key'
            });
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
