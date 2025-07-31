import { ResumoOperacao } from '../types/ResumoOperacao';
import { formataMetodoPagamento } from './formatar-metodo-pagamento';
import { formatarDataHora } from './formatar-data-hora';
import { formatarDiaSemana } from './formatar-dia-semana';
import { formatarMoeda } from './formatar-moeda';

export function gerarTextoRelatorio(operacao: ResumoOperacao) {
  const data = formatarDataHora(operacao.dataOperacao);
  const diaSemana = formatarDiaSemana(operacao.dataOperacao);

  let texto = `📊 RELATÓRIO DE VENDAS\n`;
  texto += `📅 ${data} (${diaSemana})\n\n`;

  texto += `💰 RESUMO FINANCEIRO\n`;
  texto += `• Saldo Inicial: ${formatarMoeda(operacao.saldoInicial || 0)}\n`;
  texto += `• Total de Receita: ${formatarMoeda(operacao.totalReceita || 0)}\n`;
  texto += `• Saldo Final: ${formatarMoeda(operacao.saldoFinal)}\n\n`;

  texto += `📈 RESUMO DE VENDAS\n`;
  texto += `• Total de Vendas: ${operacao.totalVendas}\n`;
  texto += `• Unidades Vendidas: ${operacao.totalUnidadesVendidas}\n`;
  texto += `• Ticket Médio: ${formatarMoeda(operacao.totalVendas > 0 ? (operacao.totalReceita || 0) / operacao.totalVendas : 0)}\n\n`;

  if (operacao.resumoEspetinhos && operacao.resumoEspetinhos.length > 0) {
    texto += `🍢 VENDAS POR PRODUTO\n`;
    operacao.resumoEspetinhos.forEach((esp) => {
      texto += `• ${esp.nome}: ${esp.quantidadeVendida} unidades - ${formatarMoeda(esp.receitaGerada)}\n`;
    });
    texto += `\n`;
  }

  if (operacao.resumoClientes && operacao.resumoClientes.length > 0) {
    texto += `👥 VENDAS POR CLIENTE\n`;
    operacao.resumoClientes.forEach((cliente) => {
      texto += `• ${cliente.nome}: ${cliente.quantidadePedidos} pedidos - ${formatarMoeda(cliente.totalGasto)}\n`;
    });
    texto += `\n`;
  }

  if (operacao.resumoPagamentos && operacao.resumoPagamentos.length > 0) {
    texto += `💳 MÉTODOS DE PAGAMENTO\n`;
    operacao.resumoPagamentos.forEach((pagamento) => {
      texto += `• ${formataMetodoPagamento(pagamento.metodoPagamento)}: ${pagamento.quantidade} transações - ${formatarMoeda(pagamento.valorTotal)}\n`;
    });
    texto += `\n`;
  }

  texto += `📱 Relatório gerado pelo Sistema de Controle de Vendas`;

  return texto;
}
