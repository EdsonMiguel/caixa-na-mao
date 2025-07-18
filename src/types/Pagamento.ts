export type MetodoPagamento = 'dinheiro' | 'pix' | 'cartao-debito' | 'cartao-credito'

export interface Pagamento {
  id: string;
  clienteId?: string;
  nomeCliente?: string;
  pedidosIds: string[];
  valorTotal: number;
  dataHora: string;
  metodoPagamento: 'dinheiro' | 'pix' | 'cartao-debito' | 'cartao-credito';
}
