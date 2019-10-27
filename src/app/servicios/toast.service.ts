import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  errorToast(message: string) {
    this.toastController.create({
      message: message,
      showCloseButton: true,
      color: 'danger',
      closeButtonText: 'Cerrar',
      duration: 2000
    })
      .then(res => {
        res.present();
      });
  }

  confirmationToast(message: string) {
    this.toastController.create({
      message: message,
      showCloseButton: true,
      color: 'success',
      closeButtonText: 'Cerrar',
      duration: 2000
    })
      .then(res => {
        res.present();
      });
  }
}
