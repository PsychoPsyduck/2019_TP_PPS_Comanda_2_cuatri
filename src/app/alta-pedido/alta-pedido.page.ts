import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductoPedido } from '../clases/producto-pedido';
import { ModalController, IonSlides } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ProductosService } from '../servicios/productos.service';
import { MesasService } from '../servicios/mesas.service';
import { diccionario } from '../clases/diccionario';
import { Producto } from '../clases/producto';
import { ParserTypesService } from '../servicios/parser-types.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { DocumentReference } from '@angular/fire/firestore';
import { ToastService } from '../servicios/toast.service';


@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.page.html',
  styleUrls: ['./alta-pedido.page.scss'],
})
export class AltaPedidoPage implements OnInit {

  @ViewChild('slides', { static: true }) slides: IonSlides;

  public puedeGuardar = false;
  public form: FormGroup;
  public errorClaves;
  public productos: any;
  public mesas: any;
  public itemsPedido: Array<ProductoPedido>;
  public mesaDoc;
  mesa: any;
  idUser: any;
  user: any;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  todos: boolean = true;
  comidas: boolean = false;
  bebidas: boolean = false;
  subtotal = 0;

  constructor(
    public toast: ToastService,
    public router: Router,
    public firebaseServ: FirebaseService,
    private route: ActivatedRoute,
    public parserServ: ParserTypesService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public barcodeScanner: BarcodeScanner,
    public productosServ: ProductosService,
    public mesasServ: MesasService
  ) { }

  ngOnInit() {

    // this.mesaDoc = this.route.snapshot.paramMap.get('mesa');
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.idUser = this.router.getCurrentNavigation().extras.state.user;
        this.mesaDoc = this.router.getCurrentNavigation().extras.state.mesa;
      }
    });

    console.info("idUser", this.idUser)
    console.info("mesa", this.mesaDoc)

    this.itemsPedido = new Array<ProductoPedido>();

    if (this.mesaDoc != undefined) {
      this.mesa = this.mesaDoc;
    }

    this.productosServ.TraerTodosLosProductos().subscribe(productos => {
      this.productos = productos;
    });
    this.mesasServ.ObtenerMesas().subscribe(mesas => {
      this.mesas = mesas;
    });
  }

  cancel() {
    this.comidas = false;
    this.bebidas = false;
    this.todos = true;
    this.subtotal = 0;
    this.puedeGuardar = false;
    this.itemsPedido = new Array<ProductoPedido>();
    this.router.navigate(['/home'])
  }

  done() {
    if (!this.puedeGuardar) {
      return;
    }

    let pedido = {
      productoPedido: this.itemsPedido,
      mesa: this.mesaDoc,
      cliente: this.idUser,
      estado: diccionario.estados_pedidos.solicitado
    }

    console.log("pedido", pedido)

    this.firebaseServ.crear('pedidos', pedido)
      .then((pedido: DocumentReference) => {
        this.router.navigate(['/home'])
        this.toast.confirmationToast("Pedido registrado, puede hacer el seguimiento del mismo volviendo a escanear el código QR de su mesa");
      });
  }

  restarUnidad(id) {
    var input = (<HTMLInputElement>document.getElementById("unidad_" + id));
    var inputValue = (<HTMLInputElement>document.getElementById("unidad_" + id)).value;
    const cantidad = parseInt(inputValue, 10);
    if (cantidad > 1) {
      const result = cantidad - 1;
      input.setAttribute("value", result.toString())
    }
  }

  sumarUnidad(id) {
    var input = (<HTMLInputElement>document.getElementById("unidad_" + id));
    var inputValue = (<HTMLInputElement>document.getElementById("unidad_" + id)).value;
    const cantidad = parseInt(inputValue, 10);
    if (cantidad < 10) {
      const result = cantidad + 1;
      input.setAttribute("value", result.toString())
    }
  }

  agregarItemAlPedido(id) {

    var inputValue = (<HTMLInputElement>document.getElementById("unidad_" + id)).value;
    const idProducto = id;
    const cantidad = parseInt(inputValue, 10);

    console.info("idProducto", idProducto)
    console.info("cantidad", cantidad)

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
    // // Si no existe lo agrego al pedido
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
    this.subtotal = 0;
    this.itemsPedido.forEach(item => {
      this.subtotal += (item.cantidad * item.precio);
    })
    this.puedeGuardar = true;
  }

  puedeGuardarPedido() {
    return this.puedeGuardar && this.mesa != '';
  }

  sacarItem(idPruducto) {
    this.itemsPedido = this.itemsPedido.filter(
      item => item.idProducto !== idPruducto
    );
    this.subtotal = 0;
    this.itemsPedido.forEach(item => {
      this.subtotal += (item.cantidad * item.precio);
    })
    if (this.itemsPedido.length < 1) {
      this.puedeGuardar = false;
    }
  }

  cambiaSlide(event) {
    // if (event.target.id === 'slide-cards') {
    //   console.log("target", (event.target.children[0]).children)
    // }
  }

  filtrarProds(tipo) {

    this.slides.slideTo(0);

    switch (tipo) {
      case 0:
        this.comidas = true;
        this.bebidas = false;
        this.todos = false;
        var cardsComida = document.getElementsByClassName('cocina');
        for (let index = 0; index < cardsComida.length; index++) {
          cardsComida[index].setAttribute('style', 'display:block');
        }
        var cardsBarra = document.getElementsByClassName('barra');
        for (let index = 0; index < cardsBarra.length; index++) {
          cardsBarra[index].setAttribute('style', 'display:none');
        }
        break;
      case 1:
        this.comidas = false;
        this.bebidas = true;
        this.todos = false;
        var cardsBarra = document.getElementsByClassName('barra');
        for (let index = 0; index < cardsBarra.length; index++) {
          cardsBarra[index].setAttribute('style', 'display:block');
        }
        var cardsComida = document.getElementsByClassName('cocina');
        for (let index = 0; index < cardsComida.length; index++) {
          cardsComida[index].setAttribute('style', 'display:none');
        }
        break;
      case 2:
        this.comidas = false;
        this.bebidas = false;
        this.todos = true;
        var cardsBarra = document.getElementsByClassName('barra');
        for (let index = 0; index < cardsBarra.length; index++) {
          cardsBarra[index].setAttribute('style', 'display:block');
        }
        var cardsComida = document.getElementsByClassName('cocina');
        for (let index = 0; index < cardsComida.length; index++) {
          cardsComida[index].setAttribute('style', 'display:block');
        }
        break;
    }


    if (tipo == 0) {

    } else {



    }
  }
}
