import { ProductoPedido } from '../clases/producto-pedido'
import { Mesa } from '../clases/mesa'

export class Pedido {
  public key: string;
  public mesa: Mesa;
  public estado: string;
  public estadoCocinero: string;
  public estadoBartender: string;
  public productoPedido: Array<ProductoPedido>;
  public isDelivery: boolean;
  public responsableCocinero: string;
  public responsableBartender: string;
  public tiempoDeEsperaCocinero: number;
  public tiempoDeEsperaBartender: number;
}

