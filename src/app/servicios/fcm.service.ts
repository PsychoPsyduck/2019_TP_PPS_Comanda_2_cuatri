import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  token;

  constructor(
    //private firebase: AngularFireMessaging,
    private platform: Platform,
    public afs: AngularFirestore,
    private toast: ToastService) {


  }

  async getToken() {
    /*
      
         this.firebase.requestToken
           .subscribe(
             (token) => { 
               this.token=token;
               console.log('Permission granted! Save to the server!', token); },
             (error) => { console.error(error); },  
           );
       */

    // token=await this.firebaseX.getToken("apns-string");

    console.log(this.token);
    this.saveTokenToFirestore(this.token)
    this.toast.confirmationToast(this.token);


    //console.log(token)
    //return this.saveTokenToFirestore(token)
  }

  private saveTokenToFirestore(token) {
    let usuario = JSON.parse(sessionStorage.getItem('usuario'));


    //if (!token) return;

    const devicesRef = this.afs.collection('devices')

    const docData = {
      token,
      id: usuario.id,
      puesto: usuario.puesto,
      tipo: usuario.tipo
    }


    return devicesRef.doc(token).set(docData)
  }
}
