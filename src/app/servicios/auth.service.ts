import { Injectable, OnInit } from '@angular/core';
import { FirebaseService } from '../servicios/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  public user;

  constructor(
    public firebase: FirebaseService
  ) { }

  public ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("usuario"));
    console.log(this.user)
  }

  public obtenerUID() {
    // return "ESTE ES UN UID";
    return this.user.id;
  }
}
