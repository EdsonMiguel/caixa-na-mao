import {
  History,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  Users,
  Plus,
  Minus,
  Package,
  ArrowLeft,
} from 'lucide-react';
import { Modal } from './Modal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useState } from 'react';
import { Espetinho } from '../types/Espetinho';
import { Cliente } from '../types/Cliente';
import { Pedido } from '../types/Pedido';
import { formatarDataHora } from '../functions/formatar-data-hora';
import { useNavigation } from '../hooks/useNavigation';
import _ from 'lodash';
import { formatarMoeda } from '../functions/formatar-moeda';

interface PainelPrincipalProps {
  saldoAtual: number;
  espetinhos: Espetinho[];
  clientes: Cliente[];
  pedidos: Pedido[];
  controlarEstoque: boolean;
  onAdicionarAoPedidoAberto: (espetinhoId: string, quantidade: number, clienteId?: string) => void;
  onCancelarPedidoAguardando: (pedidoId: string) => void;
  onEntregarPedido: (pedidoId: string) => void;
  onAdicionarMaisEspetinhos: (espetinhoId: string, quantidade: number) => void;
  onAdicionarCliente: (nome: string, telefone?: string) => void;
  onSalvarEspetinho: (
    espetinho: Omit<
      Espetinho,
      'id' | 'quantidadeDisponivel' | 'quantidadeEmPreparo' | 'quantidadeFinalizada'
    >,
  ) => void;
  onEditarEspetinho: (
    id: string,
    dados: Omit<
      Espetinho,
      'id' | 'quantidadeDisponivel' | 'quantidadeEmPreparo' | 'quantidadeFinalizada'
    >,
  ) => void;
  onIniciarPreparo: (pedidoId: string) => void;
}

export function PainelPrincipal({
  saldoAtual,
  espetinhos,
  clientes,
  pedidos,
  controlarEstoque,
  onAdicionarAoPedidoAberto,
  onCancelarPedidoAguardando,
  onEntregarPedido,
  onAdicionarMaisEspetinhos,
  onAdicionarCliente,
  onSalvarEspetinho,
  onIniciarPreparo,
}: PainelPrincipalProps) {
  useScrollToTop();

  const [modalNovoPedido, setModalNovoPedido] = useState(false);
  const [modalMaisEspetinhos, setModalMaisEspetinhos] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [quantidadesPedido, setQuantidadesPedido] = useState<Record<string, number>>({});
  const [quantidadesAdicionar, setQuantidadesAdicionar] = useState<Record<string, number>>({});
  const [novoClienteNome, setNovoClienteNome] = useState('');
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'aguardando' | 'preparo'>('aguardando');
  const [observacaoPedido, setObservacaoPedido] = useState('');
  const [novoClienteForm, setNovoClienteForm] = useState({
    nome: '',
    telefone: '',
  });
  const [novoProdutoForm, setNovoProdutoForm] = useState({
    nome: '',
    preco: '',
    quantidade: '',
    observacao: '',
  });

  const pedidosEmPreparo = _.filter(pedidos, ['status', 'em-preparo']);
  const pedidosAguardandoPreparo = _.filter(pedidos, ['status', 'aguardando-preparo']);
  const pedidosEntregues = _.filter(pedidos, ['status', 'entregue']);

  const { navigate } = useNavigation();

  function abrirModalNovoPedido() {
    setModalNovoPedido(true);
    setClienteSelecionado('');
    setQuantidadesPedido({});
  }

  function alterarQuantidade(espetinhoId: string, delta: number) {
    const espetinho = espetinhos.find((e) => e.id === espetinhoId);
    if (!espetinho) return;

    const quantidadeAtual = quantidadesPedido[espetinhoId] || 0;
    const limiteMaximo = controlarEstoque ? espetinho.quantidadeDisponivel : 999;
    const novaQuantidade = Math.max(0, Math.min(quantidadeAtual + delta, limiteMaximo));

    setQuantidadesPedido((prev) => ({
      ...prev,
      [espetinhoId]: novaQuantidade,
    }));
  }

  function adicionarItensPedido() {
    // Criar novo pedido com todos os itens
    Object.entries(quantidadesPedido).forEach(([espetinhoId, quantidade]) => {
      if (quantidade > 0) {
        onAdicionarAoPedidoAberto(espetinhoId, quantidade, clienteSelecionado || undefined);
      }
    });

    setModalNovoPedido(false);
    setQuantidadesPedido({});
    setClienteSelecionado('');
    setObservacaoPedido('');
  }

  function calcularTotalPedido() {
    return Object.entries(quantidadesPedido).reduce((total, [espetinhoId, quantidade]) => {
      const espetinho = espetinhos.find((e) => e.id === espetinhoId);
      return total + (espetinho ? espetinho.preco * quantidade : 0);
    }, 0);
  }

  const temItensNoPedido = Object.values(quantidadesPedido).some((q) => q > 0);

  function alterarQuantidadeAdicionar(espetinhoId: string, delta: number) {
    const quantidadeAtual = quantidadesAdicionar[espetinhoId] || 0;
    const novaQuantidade = Math.max(0, quantidadeAtual + delta);

    setQuantidadesAdicionar((prev) => ({
      ...prev,
      [espetinhoId]: novaQuantidade,
    }));
  }

  function adicionarMaisEspetinhos() {
    Object.entries(quantidadesAdicionar).forEach(([espetinhoId, quantidade]) => {
      if (quantidade > 0) {
        onAdicionarMaisEspetinhos(espetinhoId, quantidade);
      }
    });
    setModalMaisEspetinhos(false);
    setQuantidadesAdicionar({});
  }

  function adicionarClienteRapido() {
    if (novoClienteNome.trim()) {
      onAdicionarCliente(novoClienteNome.trim());
      setNovoClienteNome('');
    }
  }

  function adicionarNovoCliente() {
    if (novoClienteForm.nome.trim()) {
      onAdicionarCliente(novoClienteForm.nome.trim(), novoClienteForm.telefone || undefined);
      setNovoClienteForm({ nome: '', telefone: '' });
      setModalNovoCliente(false);
    }
  }

  function adicionarNovoProduto() {
    if (novoProdutoForm.nome && novoProdutoForm.preco) {
      const preco = parseFloat(novoProdutoForm.preco);
      const quantidade = parseInt(novoProdutoForm.quantidade) || 0;

      onSalvarEspetinho({
        nome: novoProdutoForm.nome,
        preco: preco,
        observacao: novoProdutoForm.observacao || undefined,
      });

      if (quantidade > 0) {
        // Add to stock after creating
        setTimeout(() => {
          const novoEspetinho = espetinhos.find((e) => e.nome === novoProdutoForm.nome);
          if (novoEspetinho) {
            onAdicionarMaisEspetinhos(novoEspetinho.id, quantidade);
          }
        }, 100);
      }

      setNovoProdutoForm({
        nome: '',
        preco: '',
        quantidade: '',
        observacao: '',
      });
      setModalNovoProduto(false);
    }
  }

  const temItensParaAdicionar = Object.values(quantidadesAdicionar).some((q) => q > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('home')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Caixa Diário</h1>
              <p className="text-sm text-gray-600">Gestão de pedidos e vendas</p>
            </div>
            <button
              onClick={() => {
                navigate('fechamento');
              }}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Fechar Dia
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <DollarSign size={24} />
              <div>
                <p className="text-orange-100 text-sm font-medium">Saldo em Caixa</p>
                <p className="text-2xl font-bold">{formatarMoeda(saldoAtual)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Fixo */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-[120px] z-10">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => navigate('historico')}
              className="bg-gray-100 text-gray-700 py-2 px-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex flex-col items-center gap-1"
            >
              <History size={16} />
              <span className="text-xs">Histórico</span>
            </button>
            <button
              onClick={() => navigate('pedidos')}
              className="bg-gray-100 text-gray-700 py-2 px-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex flex-col items-center gap-1"
            >
              <ShoppingCart size={16} />
              <span className="text-xs">Pedidos</span>
            </button>
            <button
              onClick={() => navigate('pagamentos')}
              className={`py-2 px-2 rounded-lg font-medium transition-colors flex flex-col items-center gap-1 ${
                pedidosEntregues.length > 0
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DollarSign size={16} />
              <span className="text-xs">Pagamentos</span>
              {pedidosEntregues.length > 0 && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => navigate('cadastros')}
              className="bg-gray-100 text-gray-700 py-2 px-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex flex-col items-center gap-1"
            >
              <Users size={16} />
              <span className="text-xs">Cadastros</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {controlarEstoque && (
              <button
                onClick={() => setModalMaisEspetinhos(true)}
                className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Package size={18} />
                <span>Estoque</span>
              </button>
            )}
            <button
              onClick={abrirModalNovoPedido}
              className={`bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 ${
                controlarEstoque ? '' : 'col-span-2'
              }`}
            >
              <Plus size={18} />
              <span>Novo Pedido</span>
            </button>
          </div>
        </div>

        {/* Novo Pedido Fixo */}

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto" data-scroll-container>
          {/* Abas de Pedidos */}
          <div className="px-4 md:px-6 py-6">
            {/* Navegação das Abas */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setAbaAtiva('aguardando')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  abaAtiva === 'aguardando'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock size={18} />
                <span>Aguardando</span>
                {pedidosAguardandoPreparo.length > 0 && (
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                      abaAtiva === 'aguardando'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {pedidosAguardandoPreparo.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAbaAtiva('preparo')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  abaAtiva === 'preparo'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingCart size={18} />
                <span>Em Preparo</span>
                {pedidosEmPreparo.length > 0 && (
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                      abaAtiva === 'preparo'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {pedidosEmPreparo.length}
                  </span>
                )}
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="min-h-[400px]">
              {abaAtiva === 'aguardando' && (
                <div>
                  {pedidosAguardandoPreparo.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                      <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Nenhum pedido aguardando
                      </h3>
                      <p className="text-gray-500">Crie um novo pedido para começar</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pedidosAguardandoPreparo.map((pedido) => (
                        <div
                          key={pedido.id}
                          className="bg-white rounded-xl border-2 border-orange-200 p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900">
                                  {pedido.nomeCliente || 'Pedido Balcão'}
                                </h3>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">
                                Criado em {formatarDataHora(pedido.dataHora)}
                              </p>

                              {pedido.observacao && (
                                <div className="bg-orange-100 border border-orange-200 rounded-lg p-2 mb-3">
                                  <p className="text-sm text-orange-800 italic">
                                    "{pedido.observacao}"
                                  </p>
                                </div>
                              )}

                              <div className="bg-orange-50 rounded-lg p-3 mb-4">
                                <div className="space-y-2">
                                  {pedido.itens.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span className="text-gray-700">
                                        {item.quantidade}x {item.nomeEspetinho}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {formatarMoeda(item.valorTotal)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-sm mb-4">
                                <span className="text-gray-600">
                                  {pedido.itens.reduce((total, item) => total + item.quantidade, 0)}{' '}
                                  itens
                                </span>
                                <span className="font-bold text-gray-900">
                                  Total: {formatarMoeda(pedido.valorTotal)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => onIniciarPreparo(pedido.id)}
                              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <Clock size={18} />
                              Iniciar Preparo
                            </button>
                            <button
                              onClick={() => onCancelarPedidoAguardando(pedido.id)}
                              className="px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                              title="Cancelar Pedido"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {abaAtiva === 'preparo' && (
                <div>
                  {pedidosEmPreparo.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                      <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Nenhum pedido em preparo
                      </h3>
                      <p className="text-gray-500">
                        {pedidosAguardandoPreparo.length > 0
                          ? `Há ${pedidosAguardandoPreparo.length} pedido(s) aguardando preparo`
                          : 'Crie um novo pedido para começar'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pedidosEmPreparo.map((pedido) => (
                        <div
                          key={pedido.id}
                          className="bg-white rounded-xl border-2 border-yellow-200 p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900">
                                  {pedido.nomeCliente || 'Pedido Balcão'}
                                </h3>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">
                                Iniciado em {formatarDataHora(pedido.dataHora)}
                              </p>

                              {pedido.observacao && (
                                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-2 mb-3">
                                  <p className="text-sm text-yellow-800 italic">
                                    "{pedido.observacao}"
                                  </p>
                                </div>
                              )}

                              <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                                <div className="space-y-2">
                                  {pedido.itens.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span className="text-gray-700">
                                        {item.quantidade}x {item.nomeEspetinho}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {formatarMoeda(item.valorTotal)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-sm mb-4">
                                <span className="text-gray-600">
                                  {pedido.itens.reduce((total, item) => total + item.quantidade, 0)}{' '}
                                  itens
                                </span>
                                <span className="font-bold text-gray-900">
                                  Total: {formatarMoeda(pedido.valorTotal)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onEntregarPedido(pedido.id)}
                            disabled={pedido.status !== 'em-preparo'}
                            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} />
                            Entregar Pedido
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Pedidos Entregues - Seção Fixa no Final */}
      {pedidosEntregues.length > 0 && (
        <div className="bg-red-50 border-t border-red-100 px-4 md:px-6 py-4 sticky bottom-0 z-10">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-red-900">
                Aguardando Pagamento ({pedidosEntregues.length})
              </h2>
              <button
                onClick={() => navigate('pagamentos')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Gerenciar Pagamentos
              </button>
            </div>

            <div className="space-y-3 max-h-32 overflow-y-auto">
              {pedidosEntregues.slice(0, 3).map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-lg border border-red-200 p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {pedido.nomeCliente || 'Pedido Balcão'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pedido.itens.reduce((total, item) => total + item.quantidade, 0)} itens •
                        Entregue {formatarDataHora(pedido.dataEntrega!)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{formatarMoeda(pedido.valorTotal)}</p>
                      <p className="text-xs text-red-500">Pendente</p>
                    </div>
                  </div>
                </div>
              ))}
              {pedidosEntregues.length > 3 && (
                <p className="text-center text-sm text-red-600">
                  +{pedidosEntregues.length - 3} pedidos aguardando pagamento
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Pedido */}
      <Modal isOpen={modalNovoPedido} onClose={() => setModalNovoPedido(false)} title="Novo Pedido">
        <div className="space-y-6">
          {/* Seleção de Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente (opcional)
            </label>
            <div className="space-y-3">
              <select
                value={clienteSelecionado}
                onChange={(e) => setClienteSelecionado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Pedido sem cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={novoClienteNome}
                  onChange={(e) => setNovoClienteNome(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  placeholder="Nome do novo cliente"
                />
                <button
                  onClick={adicionarClienteRapido}
                  disabled={!novoClienteNome.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  + Cliente
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Espetinhos */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selecionar Produtos</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {espetinhos
                .filter((esp) => (controlarEstoque ? esp.quantidadeDisponivel > 0 : true))
                .map((espetinho) => {
                  const quantidade = quantidadesPedido[espetinho.id] || 0;
                  const subtotal = quantidade * espetinho.preco;

                  return (
                    <div key={espetinho.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{espetinho.nome}</h4>
                          <p className="text-sm text-gray-600">
                            {formatarMoeda(espetinho.preco)} cada
                          </p>
                          {espetinho.observacao && (
                            <p className="text-xs text-gray-500 mt-1">{espetinho.observacao}</p>
                          )}
                          {controlarEstoque && (
                            <p className="text-xs text-gray-500">
                              Disponível: {espetinho.quantidadeDisponivel}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => alterarQuantidade(espetinho.id, -1)}
                            disabled={quantidade === 0}
                            className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-8 text-center font-semibold text-gray-900">
                            {quantidade}
                          </span>

                          <button
                            onClick={() => alterarQuantidade(espetinho.id, 1)}
                            disabled={
                              controlarEstoque && quantidade >= espetinho.quantidadeDisponivel
                            }
                            className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {quantidade > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-orange-600">
                            Subtotal: {formatarMoeda(subtotal)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Observação do Pedido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observação do Pedido (opcional)
            </label>
            <textarea
              value={observacaoPedido}
              onChange={(e) => setObservacaoPedido(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="Ex: Sem cebola, bem passado, etc."
              rows={2}
            />
          </div>

          {/* Total do Pedido */}
          {temItensNoPedido && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total do Pedido:</span>
                <span className="text-xl font-bold text-orange-600">
                  {formatarMoeda(calcularTotalPedido())}
                </span>
              </div>
              {clienteSelecionado && (
                <p className="text-sm text-gray-600 mt-1">
                  Cliente: {clientes.find((c) => c.id === clienteSelecionado)?.nome}
                </p>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={() => setModalNovoPedido(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={adicionarItensPedido}
              disabled={!temItensNoPedido}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar ao Pedido
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Novo Cliente */}
      <Modal
        isOpen={modalNovoCliente}
        onClose={() => setModalNovoCliente(false)}
        title="Cadastrar Cliente"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente *
            </label>
            <input
              type="text"
              value={novoClienteForm.nome}
              onChange={(e) => setNovoClienteForm({ ...novoClienteForm, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone (opcional)
            </label>
            <input
              type="tel"
              value={novoClienteForm.telefone}
              onChange={(e) =>
                setNovoClienteForm({
                  ...novoClienteForm,
                  telefone: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalNovoCliente(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={adicionarNovoCliente}
              disabled={!novoClienteForm.nome.trim()}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Novo Produto */}
      <Modal
        isOpen={modalNovoProduto}
        onClose={() => setModalNovoProduto(false)}
        title="Cadastrar Produto"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={novoProdutoForm.nome}
              onChange={(e) => setNovoProdutoForm({ ...novoProdutoForm, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ex: Espetinho de Frango"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço Unitário *</label>
            <input
              type="number"
              step="0.01"
              value={novoProdutoForm.preco}
              onChange={(e) =>
                setNovoProdutoForm({
                  ...novoProdutoForm,
                  preco: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade Padrão *
            </label>
            <input
              type="number"
              min="0"
              value={novoProdutoForm.quantidade}
              onChange={(e) =>
                setNovoProdutoForm({
                  ...novoProdutoForm,
                  quantidade: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Quantidade inicial padrão (deixe vazio para 0)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={novoProdutoForm.observacao}
              onChange={(e) =>
                setNovoProdutoForm({
                  ...novoProdutoForm,
                  observacao: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Observações sobre o produto"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalNovoProduto(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={adicionarNovoProduto}
              disabled={!novoProdutoForm.nome || !novoProdutoForm.preco}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </Modal>
      {/* Modal Adicionar Mais Espetinhos */}
      <Modal
        isOpen={modalMaisEspetinhos}
        onClose={() => setModalMaisEspetinhos(false)}
        title="Adicionar ao Estoque"
      >
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-800 text-sm">
              Adicione mais unidades aos produtos durante o dia
            </p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {espetinhos.map((espetinho) => {
              const quantidade = quantidadesAdicionar[espetinho.id] || 0;

              return (
                <div key={espetinho.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{espetinho.nome}</h4>
                      <p className="text-sm text-gray-600">{formatarMoeda(espetinho.preco)} cada</p>
                      {espetinho.observacao && (
                        <p className="text-xs text-gray-500 mt-1">{espetinho.observacao}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs mt-1">
                        <span
                          className={`font-medium ${
                            espetinho.quantidadeDisponivel === 0
                              ? 'text-red-600'
                              : espetinho.quantidadeDisponivel <= 5
                                ? 'text-yellow-600'
                                : 'text-green-600'
                          }`}
                        >
                          Disponível: {espetinho.quantidadeDisponivel}
                        </span>
                        {espetinho.quantidadeEmPreparo > 0 && (
                          <span className="text-blue-600 font-medium">
                            Em preparo: {espetinho.quantidadeEmPreparo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alterarQuantidadeAdicionar(espetinho.id, -1)}
                        disabled={quantidade === 0}
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-8 text-center font-semibold text-gray-900">
                        {quantidade}
                      </span>

                      <button
                        onClick={() => alterarQuantidadeAdicionar(espetinho.id, 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {quantidade > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">
                        Adicionar: {quantidade} unidades
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={() => setModalMaisEspetinhos(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={adicionarMaisEspetinhos}
              disabled={!temItensParaAdicionar}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar ao Estoque
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
