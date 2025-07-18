import { Cliente } from "./Cliente";
import { Espetinho } from "./Espetinho";
import { Pagamento } from "./Pagamento";
import { Pedido } from "./Pedido";
import { Venda } from "./Venda";

export interface EstadoDia {
  saldoInicial: number;
  saldoAtual: number;
  espetinhos: Espetinho[];
  vendas: Venda[];
  pedidos: Pedido[];
  pagamentos: Pagamento[];
  clientes: Cliente[];
  diaIniciado: boolean;
  dataOperacao: string;
}