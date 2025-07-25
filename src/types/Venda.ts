export interface Venda {
  id: string;
  pedidoId: string;
  espetinhoId: string;
  nomeEspetinho: string;
  precoUnitario: number; // Preço no momento da venda
  quantidade: number;
  valorTotal: number;
  dataHora: string;
  clienteId?: string;
  nomeCliente?: string;
  observacaoEspetinho?: string; // Observação do produto no momento da venda
}
