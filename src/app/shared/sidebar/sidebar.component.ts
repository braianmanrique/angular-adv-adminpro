import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/models/usuario.model';
import { SidebarService } from 'app/services/sidebar.service';
import { UsuarioService } from 'app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  public usuario: any ;
  public imgUrl: any = '';

  constructor(private  sidebarService: SidebarService, private usuarioService: UsuarioService) { 
    this.menuItems = this.sidebarService.menu;
    this.usuario = this.usuarioService.usuario
    this.imgUrl = usuarioService.usuario?.imageUrl;

  }

  ngOnInit(): void {
  }

}
