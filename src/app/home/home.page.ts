import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user;
  userTipo;

  constructor(
    private router: Router,
    public actionSheetController: ActionSheetController,
    private userServ: UsuariosService) { }

  OnLogOut() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    if (this.userServ.getUsuarioStorage()) {
      this.user = this.userServ.getUsuarioStorage();
      this.userTipo = this.user.tipo;
    }
  }

}
