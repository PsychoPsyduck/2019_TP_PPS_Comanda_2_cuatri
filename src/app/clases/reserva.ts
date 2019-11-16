export class Reserva {
    public key: string;
    public idPedido: string;
    public cliente: string;
    public idMesa: string;
    public estado: string;
    public fecha: string;

    constructor(key?: string, idPedido?: string, cliente?: string, idMesa?: string, estado?: string, fecha?: string) {
        this.key = key;
        this.idPedido = idPedido;
        this.cliente = cliente;
        this.idMesa = idMesa;
        this.estado = estado;
        this.fecha = fecha;
    }
}
