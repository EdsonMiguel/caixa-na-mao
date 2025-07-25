import { ArrowLeft, ShoppingCart, Calendar, DollarSign, User } from 'lucide-react';
import { Venda } from '../types/Venda';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { formatarDataHora } from '../functions/formatar-data-hora';
import { useNavigation } from '../hooks/useNavigation';
import _ from 'lodash';

interface HistoricoVendasProps {
  vendas: Venda[];
}

export function HistoricoVendas({ vendas }: HistoricoVendasProps) {
  useScrollToTop();

  const { navigate } = useNavigation();

  const totalVendido = _.sumBy(vendas, 'valorTotal');
  const totalUnidades = _.sumBy(vendas, 'quantidade');

  // Ordenar vendas por data (mais recente primeiro)
  const vendasOrdenadas = [...vendas].sort(
    (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime(),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('painel')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Histórico de Vendas</h1>
              <p className="text-sm text-gray-600">Vendas realizadas hoje</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <DollarSign size={24} />
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Vendido</p>
                  <p className="text-2xl font-bold">R$ {totalVendido.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <ShoppingCart size={24} />
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Vendas</p>
                  <p className="text-2xl font-bold">{vendas.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <User size={24} />
                <div>
                  <p className="text-green-100 text-sm font-medium">Unidades Vendidas</p>
                  <p className="text-2xl font-bold">{totalUnidades}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 pb-20" data-scroll-container>
          {vendas.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma venda realizada</h3>
              <p className="text-gray-500">As vendas aparecerão aqui conforme forem registradas</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Vendas do Dia ({vendas.length})</h2>
                <div className="text-sm text-gray-600">Ordenado por: Mais recente primeiro</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendasOrdenadas.map((venda) => (
                  <div
                    key={venda.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                            {venda.nomeEspetinho}
                          </h3>
                          <div className="text-right ml-3">
                            <p className="text-xl font-bold text-orange-600">
                              R$ {venda.valorTotal.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {venda.quantidade} unidades • R$ {venda.precoUnitario.toFixed(2)} cada
                              • {formatarDataHora(venda.dataHora)}
                            </p>
                            {venda.observacaoEspetinho && (
                              <p className="text-xs text-gray-500 italic mt-1">
                                "{venda.observacaoEspetinho}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <ShoppingCart size={16} className="text-blue-500" />
                            <span className="font-medium">{venda.quantidade} unidades</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-green-500" />
                            <span>{formatarDataHora(venda.dataHora)}</span>
                          </div>
                          {venda.nomeCliente && (
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-purple-500" />
                              <span className="font-medium">{venda.nomeCliente}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Pedido #{venda.pedidoId.slice(-6)}</span>
                          <span
                            className={`px-2 py-1 rounded-full font-medium ${
                              venda.nomeCliente
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {venda.nomeCliente ? 'Cliente' : 'Balcão'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
