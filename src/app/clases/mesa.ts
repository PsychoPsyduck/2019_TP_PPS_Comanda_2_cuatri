export class Mesa {
    public key: string; // Key de firebase
    public id: any;
    public comensales: string;
    public tipo: string;
    public foto: any;
    public estado: string;
    public numero:number;
    
    constructor(id?: any, comensales?: string, tipo?: string, foto?: any, estado?: string) {
        this.id = id;
        this.comensales = comensales;
        this.tipo = tipo;
        this.foto = foto;
        this.estado = estado;
    }
}
