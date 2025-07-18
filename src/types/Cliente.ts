export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  dataCadastro: string;
  totalCompras: number;
  ultimaCompra?: string;
}