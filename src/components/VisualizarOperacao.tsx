import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import { ResumoOperacao } from '../types/ResumoOperacao';
import { useState } from 'react';
import { formatarDiaSemana } from '../functions/formatar-dia-semana';
import { copiarParaAreaDeTransferencia } from '../functions/copiar-area-transferencia';
import { formataMetodoPagamento } from '../functions/formatar-metodo-pagamento';
import { gerarTextoRelatorio } from '../functions/gerar-texto-relatorio';
import { formatarData } from '../functions/formatar-data';
import { formatarMoeda } from '../functions/formatar-moeda';

interface VisualizarOperacaoProps {
  operacao: ResumoOperacao;
  onVoltar: () => void;
}

export function VisualizarOperacao({ operacao, onVoltar }: VisualizarOperacaoProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function gerarPDF() {
    setIsGenerating(true);
    try {
      const textoRelatorio = gerarTextoRelatorio(operacao);

      if (navigator.share) {
        try {
          await navigator.share({
            title: `Relatório de Vendas - ${formatarData(operacao.dataOperacao)}`,
            text: textoRelatorio,
          });
        } catch (error) {
          console.log('Compartilhamento cancelado ou erro:', error);
          // Fallback: copiar para clipboard
          copiarParaAreaDeTransferencia(textoRelatorio);
        }
      } else {
        // Fallback: copiar para clipboard
        copiarParaAreaDeTransferencia(textoRelatorio);
      }
    } catch (error) {
      console.error('Erro ao compartilhar texto:', error);
      alert('Erro ao compartilhar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-lg mx-auto">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onVoltar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resumo da Operação</h1>
              <p className="text-sm text-gray-600">Detalhes do dia selecionado</p>
            </div>
          </div>

          {/* Botões de Compartilhamento */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={gerarPDF}
              disabled={isGenerating}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Texto
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={24} />
              <div>
                <p className="text-blue-100 text-sm font-medium">Data da Operação</p>
                <p className="text-2xl font-bold">{formatarData(operacao.dataOperacao)}</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm capitalize">
              {formatarDiaSemana(operacao.dataOperacao)}
            </p>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div
          id="relatorio-operacao"
          className="flex-1 overflow-y-auto p-6 space-y-6"
          data-scroll-container
        >
          {/* Resumo Financeiro */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              Resumo Financeiro
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Saldo Inicial:</span>
                <span className="font-semibold text-gray-900">
                  {formatarMoeda(operacao.saldoInicial || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Receita:</span>
                <span className="font-semibold text-green-600">
                  {formatarMoeda(operacao.totalReceita || 0)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Saldo Final:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatarMoeda(operacao.saldoFinal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo de Vendas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-600" />
              Resumo de Vendas
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <ShoppingBag className="text-orange-600 mx-auto mb-2" size={24} />
                <p className="text-sm text-orange-600 font-medium">Total de Vendas</p>
                <p className="text-2xl font-bold text-orange-800">{operacao.totalVendas}</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <User className="text-orange-600 mx-auto mb-2" size={24} />
                <p className="text-sm text-orange-600 font-medium">Unidades Vendidas</p>
                <p className="text-2xl font-bold text-orange-800">
                  {operacao.totalUnidadesVendidas}
                </p>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Operação</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Data de Operação:</span>
                <span className="font-semibold text-gray-900">
                  {formatarData(operacao.dataOperacao)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Dia da Semana:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {formatarDiaSemana(operacao.dataOperacao)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Total de Transações:</span>
                <span className="font-semibold text-gray-900">{operacao.totalVendas}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Unidades Comercializadas:</span>
                <span className="font-semibold text-gray-900">
                  {operacao.totalUnidadesVendidas}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Médio */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Análise de Performance</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm text-blue-600 font-medium mb-1">Ticket Médio por Venda</p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatarMoeda(
                    operacao.totalVendas > 0
                      ? (operacao.totalReceita || 0) / operacao.totalVendas
                      : 0,
                  )}
                </p>
                <p className="text-xs text-blue-600 mt-1">Valor médio por transação realizada</p>
              </div>
            </div>
          </div>

          {/* Resumo Detalhado por Produto */}
          {operacao.resumoEspetinhos && operacao.resumoEspetinhos.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Produto</h2>

              <div className="space-y-3">
                {operacao.resumoEspetinhos.map((esp, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{esp.nome}</h3>
                      <span className="font-bold text-orange-600">
                        {formatarMoeda(esp.receitaGerada)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Vendidas: {esp.quantidadeVendida} unidades</p>
                      <p>Preço unitário: {formatarMoeda(esp.precoVenda)}</p>
                      {esp.observacao && <p className="italic">"{esp.observacao}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumo por Cliente */}
          {operacao.resumoClientes && operacao.resumoClientes.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Cliente</h2>

              <div className="space-y-3">
                {operacao.resumoClientes.map((cliente, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{cliente.nome}</h3>
                        {cliente.telefone && (
                          <p className="text-sm text-gray-600">{cliente.telefone}</p>
                        )}
                      </div>
                      <span className="font-bold text-blue-600">
                        {formatarMoeda(cliente.totalGasto)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        {cliente.quantidadePedidos}{' '}
                        {cliente.quantidadePedidos === 1 ? 'pedido' : 'pedidos'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumo por Método de Pagamento */}
          {operacao.resumoPagamentos && operacao.resumoPagamentos.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h2>

              <div className="space-y-3">
                {operacao.resumoPagamentos.map((pagamento, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {formataMetodoPagamento(pagamento.metodoPagamento)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {pagamento.quantidade}{' '}
                          {pagamento.quantidade === 1 ? 'transação' : 'transações'}
                        </p>
                      </div>
                      <span className="font-bold text-purple-600">
                        {formatarMoeda(pagamento.valorTotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nota Informativa */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm text-center">
              📊 Este resumo apresenta os dados históricos completos da operação do dia selecionado.
              Todas as informações foram capturadas no momento das transações, preservando o
              contexto histórico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
