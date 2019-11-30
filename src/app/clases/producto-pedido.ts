export class ProductoPedido {
    public idProducto: string;
    public cantidad: number;
    public tipo: string;
    public estado: boolean;
    public nombre: string;
    public precio: number;
    public tiempoElaboracion: string;
    public entrega: any;    
    public descripcion: string;

    constructor(idProducto?, cantidad?, tipo?, estado?, nombre?, precio?, tiempo?, entrega?, idPedido?, descripcion?) {
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.estado = estado;
        this.nombre = nombre;
        this.precio = precio;
        this.tiempoElaboracion = tiempo;
        this.entrega = entrega;
        this.descripcion = descripcion;
    }
}
