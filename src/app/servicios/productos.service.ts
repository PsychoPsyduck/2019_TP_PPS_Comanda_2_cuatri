import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/operators'
import { Producto } from '../clases/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(public firebase: FirebaseService) {}

  TraerTodosLosProductos() {
    return this.firebase.traerColeccion("/productos").pipe(
      map(productos => {
        return productos.map(a => {
          const data = a.payload.doc.data() as Producto;
          data.key = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  AgregarProducto(producto: Producto) {
    let foto1 = producto.foto1;
    let foto2 = producto.foto2;
    let foto3 = producto.foto3;
    producto.foto1 = null;
    producto.foto2 = null;
    producto.foto3 = null;
    return this.firebase.crear("/productos", producto).then(productoBd => {
      if (foto1 != null) {
        this.firebase
          .subirImagenYTraerURl(`/productos/${producto.nombre}1`, foto1)
          .then(link => {
            debugger;
            productoBd.update({ foto1: link });
          });
      }
      if (foto2 != null) {
        this.firebase
          .subirImagenYTraerURl(`/productos/${producto.nombre}2`, foto2)
          .then(link => {
            productoBd.update({ foto2: link });
          });
      }
      if (foto3 != null) {
        this.firebase
          .subirImagenYTraerURl(`/productos/${producto.nombre}3`, foto3)
          .then(link => {
            productoBd.update({ foto3: link });
          });
      }
    });
  }
}
