import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user;

  constructor(
    public firebase: FirebaseService
  ) { }

  public ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("usuario"));
    console.log(this.user)
  }

  public obtenerUID() {
    return this.user.id;
    // return "ESTE ES UN UID";
  }
}
