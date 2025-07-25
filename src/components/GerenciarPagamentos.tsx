import  { useState } from 'react';
import { ArrowLeft, DollarSign, CreditCard, Smartphone, Banknote, User, Clock, CheckCircle } from 'lucide-react';
import {Modal} from './Modal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Pedido } from '../types/Pedido';
import { Pagamento } from '../types/Pagamento';
import { Configuracoes } from '../types/Configuracoes';
import { formatarDataHora } from '../functions/formatar-data-hora';
import { useNavigation } from '../hooks/useNavigation';
import { formataMetodoPagamento } from '../functions/formata-metodo-pagamento';
import { QrCodePix } from './QrCodePix';

interface GerenciarPagamentosProps {
  pedidos: Pedido[];
  pagamentos: Pagamento[];
  configuracoes: Configuracoes;
  onProcessarPagamento: (pedidosIds: string[], metodoPagamento: 'dinheiro' | 'pix' | 'cartao-debito' | 'cartao-credito') => void;
}

export function GerenciarPagamentos({ 
  pedidos, 
  pagamentos,
  onProcessarPagamento 
}: GerenciarPagamentosProps) {
  useScrollToTop();

  const [modalPagamento, setModalPagamento] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  const [pedidosSelecionados, setPedidosSelecionados] = useState<string[]>([]);
  const [metodoPagamento, setMetodoPagamento] = useState<'dinheiro' | 'pix' | 'cartao-debito' | 'cartao-credito'>('dinheiro');

  const pedidosEntregues = pedidos.filter(p => p.status === 'entregue');

  const { navigate } = useNavigation()


 


  function agruparPedidosPorCliente() {
    const grupos: { [key: string]: Pedido[] } = {};
    
    pedidosEntregues.forEach(pedido => {
      const chave = pedido.clienteId || 'sem-cliente';
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(pedido);
    });

    return grupos;
  };

  function abrirModalPagamento(clienteId: string | null, pedidosDoCliente: Pedido[]) {
    setClienteSelecionado(clienteId);
    setPedidosSelecionados(pedidosDoCliente.map(p => p.id));
    setModalPagamento(true);
  };

  function togglePedidoSelecionado(pedidoId: string) {
    setPedidosSelecionados(prev => 
      prev.includes(pedidoId) 
        ? prev.filter(id => id !== pedidoId)
        : [...prev, pedidoId]
    );
  };

  function calcularTotalSelecionado() {
    return pedidosEntregues
      .filter(p => pedidosSelecionados.includes(p.id))
      .reduce((total, pedido) => total + pedido.valorTotal, 0);
  };

  function processarPagamento() {
    if (pedidosSelecionados.length > 0) {
      onProcessarPagamento(pedidosSelecionados, metodoPagamento);
      setModalPagamento(false);
      setPedidosSelecionados([]);
      setClienteSelecionado(null);
    }
  };

  const grupos = agruparPedidosPorCliente();
  const totalPendente = pedidosEntregues.reduce((total, pedido) => total + pedido.valorTotal, 0);

  function getIconeMetodoPagamento(metodo: string) {
    switch (metodo) {
      case 'dinheiro': return <Banknote size={16} className="text-green-600" />;
      case 'pix': return <Smartphone size={16} className="text-blue-600" />;
      case 'cartao-debito': return <CreditCard size={16} className="text-purple-600" />;
      case 'cartao-credito': return <CreditCard size={16} className="text-orange-600" />;
      default: return <DollarSign size={16} />;
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
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Pagamentos</h1>
              <p className="text-sm text-gray-600">Controle de comandas e pagamentos</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <DollarSign size={24} />
              <div>
                <p className="text-red-100 text-sm font-medium">Total Pendente</p>
                <p className="text-2xl font-bold">R$ {totalPendente.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6" data-scroll-container>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comandas Abertas ({pedidosEntregues.length} pedidos)
          </h2>
          
          {Object.keys(grupos).length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Todos os pagamentos em dia</h3>
              <p className="text-gray-500">Não há pedidos aguardando pagamento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grupos).map(([clienteKey, pedidosDoCliente]) => {
                const totalCliente = pedidosDoCliente.reduce((total, pedido) => total + pedido.valorTotal, 0);
                const nomeCliente = pedidosDoCliente[0].nomeCliente || 'Cliente Balcão';
                
                return (
                  <div key={clienteKey} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User size={18} className="text-gray-600" />
                          <h3 className="font-semibold text-gray-900">{nomeCliente}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {pedidosDoCliente.length} {pedidosDoCliente.length === 1 ? 'pedido' : 'pedidos'} • 
                          {pedidosDoCliente.reduce((total, p) => total + p.itens.reduce((sum, item) => sum + item.quantidade, 0), 0)} itens
                        </p>
                        
                        <div className="space-y-2">
                          {pedidosDoCliente.map((pedido) => (
                            <div key={pedido.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Clock size={14} className="text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      Entregue {formatarDataHora(pedido.dataEntrega!)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    {pedido.itens.map((item, index) => (
                                      <span key={index}>
                                        {item.quantidade}x {item.nomeEspetinho}
                                        {index < pedido.itens.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    R$ {pedido.valorTotal.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-lg font-bold text-red-600">
                          Total: R$ {totalCliente.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pedidosDoCliente.length} {pedidosDoCliente.length === 1 ? 'pedido' : 'pedidos'} para pagamento
                        </p>
                      </div>
                      <button
                        onClick={() => abrirModalPagamento(clienteKey === 'sem-cliente' ? null : clienteKey, pedidosDoCliente)}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <DollarSign size={18} />
                        Receber Pagamento
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Histórico de Pagamentos */}
        {pagamentos.length > 0 && (
          <div className="px-6 pb-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pagamentos Recebidos Hoje ({pagamentos.length})
            </h2>
            
            <div className="space-y-3">
              {pagamentos.slice(-5).reverse().map((pagamento) => (
                <div key={pagamento.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getIconeMetodoPagamento(pagamento.metodoPagamento)}
                        <h3 className="font-medium text-gray-900">
                          {pagamento.nomeCliente || 'Cliente Balcão'}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {pagamento.pedidosIds.length} {pagamento.pedidosIds.length === 1 ? 'pedido' : 'pedidos'} • 
                        {formataMetodoPagamento(pagamento.metodoPagamento)} • 
                        {formatarDataHora(pagamento.dataHora)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        R$ {pagamento.valorTotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-500">Pago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Processar Pagamento */}
      <Modal
        isOpen={modalPagamento}
        onClose={() => setModalPagamento(false)}
        title="Processar Pagamento"
      >
        <div className="space-y-6">
          {/* Cliente */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {clienteSelecionado ? 
                pedidosEntregues.find(p => p.clienteId === clienteSelecionado)?.nomeCliente :
                'Cliente Balcão'
              }
            </h3>
          </div>

          {/* Seleção de Pedidos */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Pedidos para Pagamento</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pedidosEntregues
                .filter(p => clienteSelecionado ? p.clienteId === clienteSelecionado : !p.clienteId)
                .map((pedido) => (
                  <div key={pedido.id} className="border border-gray-200 rounded-lg p-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pedidosSelecionados.includes(pedido.id)}
                        onChange={() => togglePedidoSelecionado(pedido.id)}
                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Entregue {formatarDataHora(pedido.dataEntrega!)}
                            </p>
                            <div className="text-sm text-gray-700">
                              {pedido.itens.map((item, index) => (
                                <span key={index}>
                                  {item.quantidade}x {item.nomeEspetinho}
                                  {index < pedido.itens.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                            R$ {pedido.valorTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Método de Pagamento */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Método de Pagamento</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMetodoPagamento('dinheiro')}
                className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                  metodoPagamento === 'dinheiro'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote size={20} />
                <span className="font-medium">Dinheiro</span>
              </button>
              
              <button
                onClick={() => setMetodoPagamento('pix')}
                className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                  metodoPagamento === 'pix'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone size={20} />
                <span className="font-medium">PIX</span>
              </button>
              
              <button
                onClick={() => setMetodoPagamento('cartao-debito')}
                className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                  metodoPagamento === 'cartao-debito'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard size={20} />
                <span className="font-medium">Débito</span>
              </button>
              
              <button
                onClick={() => setMetodoPagamento('cartao-credito')}
                className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                  metodoPagamento === 'cartao-credito'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard size={20} />
                <span className="font-medium">Crédito</span>
              </button>
            </div>
          </div>

            <QrCodePix 
              city='São Manuel'
              key='emigueltec@gmail.com'
              name='Caixa na Mão'
              value={100}
              message='Obrigado pela preferencia'
              cep='18652506'
              transactionId='123'
            />
          {/* Total */}
          {pedidosSelecionados.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total a Receber:</span>
                <span className="text-xl font-bold text-green-600">
                  R$ {calcularTotalSelecionado().toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {pedidosSelecionados.length} {pedidosSelecionados.length === 1 ? 'pedido selecionado' : 'pedidos selecionados'}
              </p>
            </div>
          )}

       

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={() => setModalPagamento(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={processarPagamento}
              disabled={pedidosSelecionados.length === 0}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Confirmar Pagamento
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}