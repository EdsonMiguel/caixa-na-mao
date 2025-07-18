import { ResumoOperacao } from "../types/ResumoOperacao";
import { formataMetodoPagamento } from "./formata-metodo-pagamento";
import { formatarDataHora } from "./formatar-data-hora";
import { formatarDiaSemana } from "./formatar-dia-semana";

  export function gerarTextoRelatorio(operacao: ResumoOperacao) {
    const data = formatarDataHora(operacao.dataOperacao);
    const diaSemana = formatarDiaSemana(operacao.dataOperacao);
    
    let texto = `📊 RELATÓRIO DE VENDAS\n`;
    texto += `📅 ${data} (${diaSemana})\n\n`;
    
    texto += `💰 RESUMO FINANCEIRO\n`;
    texto += `• Saldo Inicial: R$ ${operacao.saldoInicial?.toFixed(2) || '0,00'}\n`;
    texto += `• Total de Receita: R$ ${operacao.totalReceita?.toFixed(2) || '0,00'}\n`;
    texto += `• Saldo Final: R$ ${operacao.saldoFinal.toFixed(2)}\n\n`;
    
    texto += `📈 RESUMO DE VENDAS\n`;
    texto += `• Total de Vendas: ${operacao.totalVendas}\n`;
    texto += `• Unidades Vendidas: ${operacao.totalUnidadesVendidas}\n`;
    texto += `• Ticket Médio: R$ ${operacao.totalVendas > 0 ? ((operacao.totalReceita || 0) / operacao.totalVendas).toFixed(2) : '0,00'}\n\n`;
    
    if (operacao.resumoEspetinhos && operacao.resumoEspetinhos.length > 0) {
      texto += `🍢 VENDAS POR PRODUTO\n`;
      operacao.resumoEspetinhos.forEach(esp => {
        texto += `• ${esp.nome}: ${esp.quantidadeVendida} unidades - R$ ${esp.receitaGerada.toFixed(2)}\n`;
      });
      texto += `\n`;
    }
    
    if (operacao.resumoClientes && operacao.resumoClientes.length > 0) {
      texto += `👥 VENDAS POR CLIENTE\n`;
      operacao.resumoClientes.forEach(cliente => {
        texto += `• ${cliente.nome}: ${cliente.quantidadePedidos} pedidos - R$ ${cliente.totalGasto.toFixed(2)}\n`;
      });
      texto += `\n`;
    }
    
    if (operacao.resumoPagamentos && operacao.resumoPagamentos.length > 0) {
      texto += `💳 MÉTODOS DE PAGAMENTO\n`;
      operacao.resumoPagamentos.forEach(pagamento => {
        texto += `• ${formataMetodoPagamento(pagamento.metodoPagamento)}: ${pagamento.quantidade} transações - R$ ${pagamento.valorTotal.toFixed(2)}\n`;
      });
      texto += `\n`;
    }
    
    texto += `📱 Relatório gerado pelo Sistema de Controle de Vendas`;
    
    return texto;
  };