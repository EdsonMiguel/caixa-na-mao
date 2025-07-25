import { ArrowLeft, ShoppingBag,  Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Pedido } from '../types/Pedido';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { formatarDataHora } from '../functions/formatar-data-hora';
import _ from 'lodash'
import { useNavigation } from '../hooks/useNavigation';
import { formatarStatusPedido } from '../functions/formatar-status-pedido';

interface VisaoPedidosProps {
  pedidos: Pedido[];
}

export function VisaoPedidos({ pedidos }: VisaoPedidosProps) {
  useScrollToTop();
  const { navigate } = useNavigation()

  const pedidosOrdenados = _.orderBy(pedidos, [p => new Date(p.dataHora)], ['desc']);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-500';
      case 'entregue': return 'bg-blue-500';
      case 'em-preparo': return 'bg-yellow-500';
      case 'aguardando-preparo': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };



  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pago': return 'text-green-600';
      case 'entregue': return 'text-blue-600';
      case 'em-preparo': return 'text-yellow-600';
      case 'aguardando-preparo': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-lg mx-auto">
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
              <h1 className="text-xl font-bold text-gray-900">Visão de Pedidos</h1>
              <p className="text-sm text-gray-600">Todos os pedidos do dia</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <ShoppingBag size={24} />
              <div>
                <p className="text-orange-100 text-sm font-medium">Pedidos do Dia</p>
                <p className="text-2xl font-bold">{pedidos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6" data-scroll-container>
          {pedidos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">Os pedidos aparecerão aqui conforme forem registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pedidos do Dia ({pedidos.length})
              </h2>
              
              {pedidosOrdenados.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  {/* Cabeçalho do Pedido */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(pedido.status)}`}></div>
                        <h3 className="font-semibold text-gray-900">
                          {pedido.nomeCliente || 'Pedido Balcão'}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {pedido.itens.reduce((total, item) => total + item.quantidade, 0)} {pedido.itens.reduce((total, item) => total + item.quantidade, 0) === 1 ? 'item' : 'itens'} • {formatarDataHora(pedido.dataHora)}
                      </p>
                      <p className={`text-xs font-medium ${getStatusTextColor(pedido.status)}`}>
                        {formatarStatusPedido(pedido.status)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        R$ {pedido.valorTotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                  </div>

                  {/* Observação do Pedido */}
                  {pedido.observacao && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-800 italic">"{pedido.observacao}"</p>
                    </div>
                  )}

                  {/* Itens do Pedido */}
                  <div className="space-y-2">
                    {pedido.itens.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.nomeEspetinho}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>{item.quantidade}x unidades • R$ {item.precoUnitario.toFixed(2)} cada</span>
                            </div>
                            {item.observacaoEspetinho && (
                              <p className="text-xs text-gray-500 italic mt-1">"{item.observacaoEspetinho}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              R$ {item.valorTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Informações de Status */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Pedido #{pedido.id.slice(-6)}</span>
                      <div className="flex items-center gap-4">
                        {pedido.dataInicioPreparo && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Preparo: {formatarDataHora(pedido.dataInicioPreparo)}
                          </span>
                        )}
                        {pedido.dataEntrega && (
                          <span className="flex items-center gap-1">
                            <CheckCircle size={12} />
                            Entregue: {formatarDataHora(pedido.dataEntrega)}
                          </span>
                        )}
                        {pedido.dataPagamento && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={12} />
                            Pago: {formatarDataHora(pedido.dataPagamento)} • {pedido.metodoPagamento ? getNomeMetodoPagamento(pedido.metodoPagamento) : 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getNomeMetodoPagamento = (metodo: string) => {
  switch (metodo) {
    case 'dinheiro': return 'Dinheiro';
    case 'pix': return 'PIX';
    case 'cartao-debito': return 'Cartão Débito';
    case 'cartao-credito': return 'Cartão Crédito';
    default: return metodo;
  }
}