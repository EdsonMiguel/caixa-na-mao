import { MetodoPagamento } from '../types/Pagamento';

export function formataMetodoPagamento(metodo: MetodoPagamento) {
  switch (metodo) {
    case 'dinheiro':
      return 'Dinheiro';
    case 'pix':
      return 'PIX';
    case 'cartao-debito':
      return 'Cartão Débito';
    case 'cartao-credito':
      return 'Cartão Crédito';
    default:
      return metodo;
  }
}
