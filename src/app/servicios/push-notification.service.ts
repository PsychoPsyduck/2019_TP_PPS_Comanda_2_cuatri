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
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }
  actualizarTokenDispositivo() {
    this.fcm.getToken().then(token => {
      this.actualizarToken(token);
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }

  actualizarToken(token) {
    let usuario = this.usuarioServ.getUsuarioStorage();
    if (usuario != null) {
      usuario.token = token;
      this.firebaseServ.actualizar('usuarios', usuario.id, usuario)
    }
  }

  EnviarNotificacion(tipo: string, data:any): Promise<Object>
  {
    let direccion= this.url + tipo + "&data=" + JSON.stringify(data);
    return this.http.post(direccion, {"tipo": tipo, "data": data}).toPromise();
  }
}
