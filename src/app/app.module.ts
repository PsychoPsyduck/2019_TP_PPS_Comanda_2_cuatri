import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { FIREBASE_CONFIG } from '../environments/environment';
import { UsuariosService } from './servicios/usuarios.service';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AltaPedidoPageModule } from './alta-pedido/alta-pedido.module';
import { FCM } from '@ionic-native/fcm/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule, AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    AltaPedidoPageModule

  ],
  providers: [
    StatusBar,
    SplashScreen,
    UsuariosService,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera, ImagePicker, BarcodeScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
