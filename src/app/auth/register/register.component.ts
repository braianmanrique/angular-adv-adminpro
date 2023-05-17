import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
export class RegisterComponent implements OnInit {
  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['braian', [Validators.required, Validators.minLength(3)]],
    email: ['braian@hotmail.com', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    terminos: [false, [Validators.requiredTrue]]

  }, 
   { Validators: this.passwordIguales('password','password2')
  }
  ) ;
  
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }
  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm); 
    if(this.registerForm.invalid){
      return;
    }

    // create user
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe({
      next: resp => {
        console.log(resp)
      },
      error : (err) => {
      Swal.fire('Error', err.error.msg, 'error');
     }});
  }


  campoNoValido(campo: string): boolean{
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  contrasenasValidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value
    if(pass1 === pass2){
      return false;
    }else{
      return true;
    }
  }

  passwordIguales(pass1Name: string, pass2Name: string){
      return (formGroup: FormGroup) => {
        const pass1Control = formGroup.get(pass1Name)
        const pass2Control = formGroup.get(pass2Name)
        if(pass1Control?.value === pass2Control?.value){
          pass2Control?.setErrors(null)
        }else{
          pass2Control?.setErrors({noEsIgual: true})
        }

      }
  }

}
