export class Producto {
    public key: any;
    public nombre: string;
    public descripcion: string;
    public tiempoElaboracion: number;
    public precio: number;
    public cantidad: number;
    public foto1: string;
    public foto2: string;
    public foto3: string;
    public tipo: string;

    constructor(key?, nombre?, descripcion?, tiempoElaboracion?, precio?, cantidad?, foto1?, foto2?, foto3?, tipo?) {
        this.key = key;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tiempoElaboracion = tiempoElaboracion;
        this.precio = precio;
        this.cantidad = cantidad;
        this.foto1 = foto1;
        this.foto2 = foto2;
        this.foto3 = foto3;
        this.tipo = tipo;
    }
}
