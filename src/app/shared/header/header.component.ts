import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public imgUrl: any = '';
  public usuario: any ;
  constructor(private usuarioService : UsuarioService,private router: Router, private _ngZone: NgZone) {
    this.imgUrl = usuarioService.usuario?.imageUrl;
    this.usuario = this.usuarioService.usuario
   }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioService.logout();
  }


}
