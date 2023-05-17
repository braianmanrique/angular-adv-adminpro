import { Component, OnInit , AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/services/usuario.service';
import { error } from 'console';
import Swal from 'sweetalert2'

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'
  ]
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn : ElementRef | undefined;
  public formSummited = false;

  public loginForm : FormGroup= this.fb.group({
    email: [localStorage.getItem('email') || '', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  })
  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService) { }


  ngAfterViewInit(): void {
   this.googleInit();

  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: "116676608172-o1cj9hh4u9urrscqi5a7dmvp2cjtkhid.apps.googleusercontent.com",
      callback: (response:any) =>  this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
        this.googleBtn?.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );   
  }

  handleCredentialResponse(response: any){
    console.log("Encoded JWT ID token: " + response.credential);    
    this.usuarioService.loginGoogle(response.credential).subscribe(
      resp=> {
        this.router.navigateByUrl('/');
        console.log(resp);
      }
    )
  }


  login(){
    console.log(this.loginForm.value)
    const dataForm = this.loginForm.value;

    this.usuarioService.login(dataForm).subscribe({
      next: resp => {
        if(this.loginForm.get('remember')?.value){
          localStorage.setItem('email', this.loginForm.get('email')?.value)
        }else{
          localStorage.removeItem('email')
        }
        this.router.navigateByUrl('/');
        console.log(resp)
      },
      error: (err) =>{
        Swal.fire('Error', err.error.msg, 'error')
    }
    })
    
  }


}
