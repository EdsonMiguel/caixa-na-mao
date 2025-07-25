import { MetodoPagamento } from './Pagamento';
import { Venda } from './Venda';

export type PedidoStatus =
  | 'em-montagem'
  | 'aguardando-preparo'
  | 'em-preparo'
  | 'entregue'
  | 'pago';

export interface Pedido {
  id: string;
  clienteId?: string;
  nomeCliente?: string;
  telefoneCliente?: string;
  observacao?: string;
  itens: Venda[];
  valorTotal: number;
  dataHora: string;
  status: PedidoStatus;
  dataInicioPreparo?: string;
  dataEntrega?: string;
  dataPagamento?: string;
  metodoPagamento?: MetodoPagamento;
}
