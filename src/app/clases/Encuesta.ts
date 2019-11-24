export class Encuesta{

    id:string;
    primeraVez: boolean;
    servicio: string;
    comida: number;
    mesa: string;
    comentario:string;
    fotos: Array<string>;

    
    toJson() {
        return JSON.parse(JSON.stringify(this));
    }
}