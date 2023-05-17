import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from 'app/interfaces/login-form.interface';
import { RegisterForm } from 'app/interfaces/regiset-form.interface';
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
  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { 
  }

  validarToken(){
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers : {
        'x-token': token
      }
    }).pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token)
      }),
      map(resp=> true ),
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
