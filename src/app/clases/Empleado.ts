export class Empleado {
    public id: string; // Id de Firebase
    public nombre: string;
    public apellido: string;
    public dni: string;
    public cuil: string;
    public perfil: string;
    public foto: any;
  
    constructor(id?: string, nombre?: string, apellido?: string, dni?: string, cuil?: string, perfil?: string, foto?: string) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.dni = dni;
      this.cuil = cuil;
      this.perfil = perfil;
      this.foto = foto;
    }
  }
   