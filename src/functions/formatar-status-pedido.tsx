import { PedidoStatus } from "../types/Pedido";

export function formatarStatusPedido(status: PedidoStatus){
    switch (status) {
      case 'pago': return 'Pago';
      case 'entregue': return 'Entregue';
      case 'em-preparo': return 'Em Preparo';
      case 'aguardando-preparo': return 'Aguardando Preparo';
      default: return status;
    }
  };