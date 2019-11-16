import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageHandlerService {

  static knownErrors: any = [
    {
      code: 'auth/email-already-in-use',
      message: 'El email ya está en uso.'
    },
    {
      code: 'auth/user-not-found',
      message: 'El email no se encuentra registrado.'
    },
    {
      code: 'auth/wrong-password',
      message: 'Contraseña Incorrecta.'
    },
    {
      code: 'auth/network-request-failed',
      message: 'No hay conexión a internet.'
    },
    {
      code: 'auth/invalid-email',
      message: 'Email inválido.'
    },
  ];

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) { }

  public getErrorMessage(error) {
    let mensaje = 'Error desconocido';
    for (const errorA of MessageHandlerService.knownErrors) {
      if ((error.code as string) === (errorA.code as string)) {
        mensaje = errorA.message;
        break;
      }
    }

    return mensaje;
  }

  public async mostrarError(error: any, message?: string) {
    console.log('Ocurrio un error', error);
    const errorMessage = this.getErrorMessage(error);

    const alert = await this.toastCtrl.create({
      message: message ? (message + errorMessage) : errorMessage,
      duration: 4000,
      position: 'top',
    });
    alert.present();
  }

  // Dudo que funcione, mostrará [Object object]
  public async mostrarErrorLiteral(error: any) {
    const alert = await this.toastCtrl.create({
      message: error,
      duration: 4000,
      position: 'top',
    });

    alert.present();
  }

  public async mostrarMensaje(message: string) {
    const alert = await this.toastCtrl.create({
      message,
      duration: 4000,
      position: 'top',
    });
    alert.present();
  }

  public async mostrarMensajeCortoAbajo(message) {
    const alert = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    alert.present();
  }

  public async mostrarMensajeConfimación(mensaje: string, title?: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: mensaje,
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Sí',
          handler: () => {
            alert.dismiss(true);
            return true;
          }
        }
      ]
    }
    );
    return alert;
  }
}
