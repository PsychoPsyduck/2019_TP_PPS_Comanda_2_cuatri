import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { UsuariosService } from './usuarios.service';
import { FirebaseService } from './firebase.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  url = "https://us-central1-lacomanda-91df5.cloudfunctions.net/enviarNotificacion?tipo=";

  pushes: any = [];
  constructor(private fcm: FCM,
    public plt: Platform,
    private usuarioServ: UsuariosService,
    private firebaseServ: FirebaseService,
    private http: HttpClient) {
    this.plt.ready()
      .then(() => {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          this.actualizarToken(token);
        });
      })
  }
  
  actualizarTokenDispositivo() {
    this.fcm.getToken().then(token => {
      this.actualizarToken(token);
    });
  }

  suscribirseATopico(topico:string) {
    this.fcm.subscribeToTopic(topico);
  }

  desuscribirseATopico(topico:string) {
    this.fcm.unsubscribeFromTopic(topico);
  }

  actualizarToken(token) {
    let usuario = this.usuarioServ.getUsuarioStorage();
    if (usuario != null) {
      usuario.token = token;
      this.firebaseServ.actualizar('usuarios', usuario.id, usuario).then(() => {
        this.suscribirseATopico(usuario.tipo)
      })
    }
  }

  EnviarNotificacion(tipo: string, mensaje: string): Promise<Object> {
    let enlace = this.url + tipo + "&mensaje=" + mensaje;
    return this.http.get(enlace).toPromise();
  }
}
