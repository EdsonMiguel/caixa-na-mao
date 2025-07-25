import { MetodoPagamento } from './Pagamento';

type ResumoCliente = {
  id: string;
  nome: string;
  telefone?: string;
  totalGasto: number;
  quantidadePedidos: number;
};

type ResumoEspetinho = {
  id: string;
  nome: string;
  precoVenda: number;
  quantidadeVendida: number;
  receitaGerada: number;
  observacao?: string;
};

type ResumoPagamento = {
  metodoPagamento: MetodoPagamento;
  quantidade: number;
  valorTotal: number;
};

export interface ResumoOperacao {
  id: string;
  dataOperacao: string;
  saldoFinal: number;
  saldoInicial: number;
  totalUnidadesVendidas: number;
  totalVendas: number;
  totalReceita: number;
  resumoEspetinhos: ResumoEspetinho[];
  resumoClientes: ResumoCliente[];
  resumoPagamentos: ResumoPagamento[];
}
