import { environment } from "environments/environment"

const base_url = environment.base_url;

export class Usuario{
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public role?: string,
        public google?: boolean,
        public img?: string,
        public uid?: string
    ){}

    imprimirUsuario(){
        console.log('user',this.nombre)
    }

    get imageUrl(){
        // localhost:3005/api/uploads/usuarios/no-image
        if(this.img?.includes('https')){
            return this.img;
        }
        if(this.img){
            return `${base_url}/uploads/usuarios/${this.img}`
            
        }else{
             return `${base_url}/uploads/usuarios/no-image`;
        }
        
    }
}