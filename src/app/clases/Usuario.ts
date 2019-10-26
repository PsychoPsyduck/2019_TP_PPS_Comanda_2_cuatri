export class Usuario
{
    id:string;
    correo:string;
    clave:string;
    tipo:string;
    puesto:string;


    toJson()
    {
        return JSON.parse(JSON.stringify(this)); 
    }

}