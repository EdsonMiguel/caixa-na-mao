export interface Espetinho {
  id: string;
  nome: string;
  preco: number;
  observacao?: string;
  quantidadeDisponivel: number;
  quantidadeEmPreparo: number;
  quantidadeFinalizada: number;
  quantidadeInicial?: number; // Para resetar no início do dia
}
