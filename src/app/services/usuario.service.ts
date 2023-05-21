import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from 'app/interfaces/login-form.interface';
import { RegisterForm } from 'app/interfaces/regiset-form.interface';
import { Usuario } from 'app/models/usuario.model';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

declare const google: any;
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  public usuario!: Usuario ;
  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { 
  }

   get token(): string{
    return  localStorage.getItem('token') || '';
   }

   get uid(): string{
    return this.usuario?.uid || '';
   }
  validarToken(){
    google.accounts.id.initialize({
      client_id: "116676608172-o1cj9hh4u9urrscqi5a7dmvp2cjtkhid.apps.googleusercontent.com",
  
    });

    return this.http.get(`${base_url}/login/renew`, {
      headers : {
        'x-token': this.token
      }
    }).pipe(
      map( (resp:any) => {

        const {email, google,nombre, role,img = '', uid} = resp.user;
        this.usuario = new Usuario(
          nombre,email,'', role, google, img, uid
        )
        this.usuario.imprimirUsuario();
        localStorage.setItem('token', resp.token)
        return true

      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    console.log('creando usuario', base_url);
    return this.http.post(`${base_url}/usuarios`, formData)
              .pipe(
                  tap( (resp:any) => {
                  localStorage.setItem('token', resp.token)
              })
    )
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}){
    data = {
      ...data,
      role: this.usuario.role!
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    } )
   
  }
  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
          .pipe(
            tap( (resp:any) => {
              localStorage.setItem('token', resp.token)
            })
          )
  }
  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
        .pipe(
          tap( (resp:any) => {
            localStorage.setItem('token', resp.token)
        }) 
        )
  }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('braian_manrique@hotmail.com', () => {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login')
      })
    })  
  }
 
}
