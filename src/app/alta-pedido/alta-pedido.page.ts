import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductoPedido } from '../clases/producto-pedido';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ProductosService } from '../servicios/productos.service';
import { MesasService } from '../servicios/mesas.service';
import { diccionario } from '../clases/diccionario';
import { Producto } from '../clases/producto';
import { ParserTypesService } from '../servicios/parser-types.service';


@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
})
export class AltaPedidoPage implements OnInit {

  public puedeGuardar = false;
  public form: FormGroup;
  public errorClaves;
  public productos: any;
  public mesas: any;
  public itemsPedido: Array<ProductoPedido>;
  public mesaDoc;
  mesa: any;

  constructor(
    public parserServ: ParserTypesService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public barcodeScanner: BarcodeScanner,
    public productosServ: ProductosService,
    public mesasServ: MesasService
  ) { }

  ngOnInit() {
    this.itemsPedido = new Array<ProductoPedido>();

    this.form = this.formBuilder.group({
      cantidad: [
        '',
        Validators.compose([Validators.required, Validators.min(1)])
      ],
      mesa: ['', Validators.required],
      producto: ['', Validators.required]
    });

    if (this.mesaDoc != undefined) { 
      this.mesa = this.mesa;
      this.form.patchValue({ mesa: this.mesaDoc }); 
    }

    this.productosServ.TraerTodosLosProductos().subscribe(productos => {
      this.productos = productos;
    });
    this.mesasServ.ObtenerMesas().subscribe(mesas => {
      this.mesas = mesas;
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  done() {
    if (!this.puedeGuardar) {
      return;
    }

    this.modalCtrl.dismiss({
      productoPedido: this.itemsPedido,
      mesa: this.form.get('mesa').value,
      cliente: this.mesa.ocupante,
      estado: diccionario.estados_pedidos.solicitado
    });
  }

  agregarItemAlPedido() {
    const idProducto = this.form.get('producto').value;
    const cantidad = parseInt(this.form.get('cantidad').value, 10);

    // Traigo el producto del array mediante la clave
    const productoSeleccionado = this.productos.filter(
      (producto: Producto) => (producto.key as number) === idProducto
    )[0];

    // Si existe solo sumo la cantidad al pedido
    let productoYaElegido = false;
    this.itemsPedido.forEach(item => {
      if (item.idProducto == idProducto) {
        item.cantidad += cantidad;
        productoYaElegido = true;
      }
    });

    var dateNow = new Date();
    // Si no existe lo agrego al pedido
    if (!productoYaElegido) {
      const productoAAgregar = {
        cantidad,
        nombre: productoSeleccionado.nombre,
        idProducto: productoSeleccionado.key,
        tipo: productoSeleccionado.tipo,
        estado: diccionario.estados_productos.en_preparacion,
        precio: productoSeleccionado.precio,
        tiempoElaboracion: productoSeleccionado.tiempo,
        // Este es el tiempo de entrega hecho en date
        entrega: this.parserServ.parseDateTimeToStringDateTime(
          new Date(dateNow.getTime() + productoSeleccionado.tiempo * 60000)
        )
      }
      this.itemsPedido.push(productoAAgregar);
      console.info("se agrega producto ", productoAAgregar, "al los pedidos", this.itemsPedido);
    }

    this.form.patchValue({ producto: '', cantidad: '' });
    this.puedeGuardar = true;
  }

  puedeGuardarPedido() {
    return this.puedeGuardar && this.form.get('mesa').value != '';
  }

  sacarItem(idPruducto) {
    this.itemsPedido = this.itemsPedido.filter(
      item => item.idProducto !== idPruducto
    );
  }

  puedeAgregarAlPedido() {
    return (
      this.form.get('cantidad').value != '' &&
      this.form.get('producto').value != ''
    );
  }

  public escanearQr() {

  }
}
