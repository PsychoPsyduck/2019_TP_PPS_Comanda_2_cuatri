// para utilizarlo agregar este import donde se tenga que usar: import {diccionario} from "../../models/diccionario";
export const diccionario = {
    /* apis:{
      reservas: "reservas/",
      productos: "productos/",
      productos_platos: "productos/platos/",
      productos_bebidas: "productos/bebidas/",
      mesas: "mesas/",
      juegos: "juegos/",
      pedidos: "pedidos/",
      lista_espera: "lista-espera/",
      reservas_agendadas: "reservas-agendadas/",
      encuesta_cliente: "encuesta-cliente/",
      encuesta_empleado: "encuesta-empleado/",
      cuentas: "cuentas/",
      delivery: "delivery/",
      chats: "chats/"
    }, */
    firestore: {
      devices: 'devices',
      notifications: 'notifications2'
    },
    estadod_lista_espera:{
      pendiente: 'pendiente',
      cancelado: 'cancelado',
      aceptado: 'aceptado'
    },
    estados_mesas: {
      libre: 'libre',
      ocupada: 'ocupada',
      asignada: 'asignada'
    },
    estados_pedidos: {
      solicitado: 'solicitado',
      aceptado: 'aceptado',
      en_preparacion: 'en preparación',
      listo: 'listo',
      entregado_mozo: 'entregado por el mozo',
      entregado: 'entregado',
      confirmado: 'confirmado',
      cuenta: 'cuenta',
      pagado: 'pagado',
    },
    estados_productos: {
      en_preparacion: false,
      listo: true
    },
    estados_reservas_agendadas: {
      sin_mesa: 'sin_mesa',
      con_mesa: 'con_mesa',
      cancelada: 'cancelada',
      confirmada: 'confirmada'
    },
    estados_platos_bebidas: {
      habilitado: 'habilitado',
      deshabilitado: 'deshabilitado',
      sin_stock: 'sin stock'
    },
    estados_reservas: {
      en_curso: 'en curso',
      finalizada: 'finalizada'
    },
    qr: {
      ingreso_local: 'ingresoLocal'
    },
    errores: {
      QR_invalido: 'código QR inválido',
      sin_pedido: 'no existe pedido'
    },
    direccion_local: {
      direccion: 'Moreno 850, C1091AAR CABA, Argentina',
      lat: -34.6119042,
      long: -58.37844980000001
    }, /*
    juegos:{
      trivia: 'Trivia',
      adivinar: 'Adivinar',
      anagrama: 'Anagrama'
    }, */
    estados_delivery: {
      en_curso: 'en curso',
      en_camino: 'en camino',
      entregado: 'entregado'
    }
  
  };
