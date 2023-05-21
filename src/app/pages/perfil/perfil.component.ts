import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'app/models/usuario.model';
import { FileUploadService } from 'app/services/file-upload.service';
import { UsuarioService } from 'app/services/usuario.service';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup ;
  public usuario !: Usuario;
  public imagenSubir!: File; 
  public imgTemp!: string | ArrayBuffer ;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {
    this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required , Validators.email]]
    })
  }

  actualizarPerfil(){
    console.log(this.perfilForm?.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe( {
      next: () => {
        const {nombre, email} = this.perfilForm.value; 
        this.usuario.nombre = nombre;
        this.usuario.email = email;
  
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success')
      }, error: (err) => {
        Swal.fire('No se puede guardar', err.error.msg, 'error')
      }

  })}


  cambiarImagen(file:File){

    this.imagenSubir = file;
    
    if(!file) {return;}
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result!;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success')
      }).catch(err => {
        Swal.fire('No se puede guardar', 'No se pudo subir la imagen', 'error')
        console.log(err)
      })
  }

}
