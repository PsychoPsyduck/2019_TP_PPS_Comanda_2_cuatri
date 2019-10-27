export class Usuario {
    id: string;
    correo: string;
    clave: string;
    tipo: string;
    puesto: string;
    nombre: string;
    apellido: string;
    dni: number;
    cuil: number;
    foto: string;


    toJson() {
        return JSON.parse(JSON.stringify(this));
    }

}