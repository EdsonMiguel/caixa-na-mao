import { useState } from 'react';
import {
  ArrowLeft,
  Users,
  Package,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';

import { Modal } from '../components/Modal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Cliente } from '../types/Cliente';
import { Espetinho } from '../types/Espetinho';
import { Venda } from '../types/Venda';
import { formatarDataHora } from '../functions/formatar-data-hora';
import { useNavigation } from '../hooks/useNavigation';

interface TelaCadastrosProps {
  clientes: Cliente[];
  espetinhos: Espetinho[];
  vendas: Venda[];
  onAdicionarCliente: (nome: string, telefone?: string) => void;
  onEditarCliente: (id: string, nome: string, telefone?: string) => void;
  onRemoverCliente: (id: string) => void;
  onSalvarEspetinho: (
    espetinho: Omit<
      Espetinho,
      'id' | 'quantidadeDisponivel' | 'quantidadeEmPreparo' | 'quantidadeFinalizada'
    >,
  ) => void;
  onRemoverEspetinho: (id: string) => void;
  onEditarEspetinho: (
    id: string,
    dados: Omit<
      Espetinho,
      'id' | 'quantidadeDisponivel' | 'quantidadeEmPreparo' | 'quantidadeFinalizada'
    >,
  ) => void;
}

export function TelaCadastros({
  clientes,
  espetinhos,
  vendas,
  onAdicionarCliente,
  onEditarCliente,
  onRemoverCliente,
  onSalvarEspetinho,
  onRemoverEspetinho,
  onEditarEspetinho,
}: TelaCadastrosProps) {
  useScrollToTop();

  const [abaAtiva, setAbaAtiva] = useState<'clientes' | 'produtos'>('clientes');

  // Estados para Cliente
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [modalEditarCliente, setModalEditarCliente] = useState<{
    isOpen: boolean;
    cliente: Cliente | null;
  }>({
    isOpen: false,
    cliente: null,
  });
  const [modalDetalhesCliente, setModalDetalhesCliente] = useState<{
    isOpen: boolean;
    cliente: Cliente | null;
  }>({
    isOpen: false,
    cliente: null,
  });
  const [novoClienteForm, setNovoClienteForm] = useState({ nome: '', telefone: '' });
  const [clienteEditando, setClienteEditando] = useState({ nome: '', telefone: '' });

  // Estados para Produto
  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [modalEditarProduto, setModalEditarProduto] = useState<{
    isOpen: boolean;
    produto: Espetinho | null;
  }>({
    isOpen: false,
    produto: null,
  });
  const [novoProdutoForm, setNovoProdutoForm] = useState({
    nome: '',
    preco: '',
    quantidade: '',
    observacao: '',
  });
  const [produtoEditando, setProdutoEditando] = useState({
    nome: '',
    preco: '',
    quantidade: '',
    observacao: '',
  });

  // Estados para confirmação de remoção
  const [confirmRemoveClient, setConfirmRemoveClient] = useState<{
    isOpen: boolean;
    cliente: Cliente | null;
  }>({
    isOpen: false,
    cliente: null,
  });

  const { navigate } = useNavigation();

  // Funções para Cliente
  function adicionarNovoCliente() {
    if (novoClienteForm.nome.trim()) {
      onAdicionarCliente(novoClienteForm.nome.trim(), novoClienteForm.telefone || undefined);
      setNovoClienteForm({ nome: '', telefone: '' });
      setModalNovoCliente(false);
    }
  }

  function abrirEdicaoCliente(cliente: Cliente) {
    setClienteEditando({ nome: cliente.nome, telefone: cliente.telefone || '' });
    setModalEditarCliente({ isOpen: true, cliente });
  }

  function salvarEdicaoCliente() {
    if (modalEditarCliente.cliente && clienteEditando.nome.trim()) {
      onEditarCliente(
        modalEditarCliente.cliente.id,
        clienteEditando.nome.trim(),
        clienteEditando.telefone.trim() || undefined,
      );
      setModalEditarCliente({ isOpen: false, cliente: null });
      setClienteEditando({ nome: '', telefone: '' });
    }
  }

  function verDetalhesCliente(cliente: Cliente) {
    setModalDetalhesCliente({ isOpen: true, cliente });
  }

  function getVendasCliente(clienteId: string) {
    return vendas.filter((venda) => venda.clienteId === clienteId);
  }

  function confirmarRemocaoCliente(cliente: Cliente) {
    const vendasCliente = getVendasCliente(cliente.id);
    if (vendasCliente.length > 0) {
      alert(
        `Não é possível remover este cliente pois ele possui ${vendasCliente.length} compra(s) registrada(s).`,
      );
      return;
    }
    setConfirmRemoveClient({ isOpen: true, cliente });
  }

  function removerCliente() {
    if (confirmRemoveClient.cliente) {
      onRemoverCliente(confirmRemoveClient.cliente.id);
      setConfirmRemoveClient({ isOpen: false, cliente: null });
    }
  }
  // Funções para Produto
  function adicionarNovoProduto() {
    if (novoProdutoForm.nome && novoProdutoForm.preco) {
      onSalvarEspetinho({
        nome: novoProdutoForm.nome,
        preco: parseFloat(novoProdutoForm.preco),
        quantidadeInicial: parseInt(novoProdutoForm.quantidade) || 0,
        observacao: novoProdutoForm.observacao || undefined,
      });
      setNovoProdutoForm({ nome: '', preco: '', quantidade: '', observacao: '' });
      setModalNovoProduto(false);
    }
  }

  function abrirEdicaoProduto(produto: Espetinho) {
    setProdutoEditando({
      nome: produto.nome,
      preco: produto.preco.toString(),
      quantidade: (produto.quantidadeInicial || 0).toString(),
      observacao: produto.observacao || '',
    });
    setModalEditarProduto({ isOpen: true, produto });
  }

  function salvarEdicaoProduto() {
    if (modalEditarProduto.produto && produtoEditando.nome && produtoEditando.preco) {
      onEditarEspetinho(modalEditarProduto.produto.id, {
        nome: produtoEditando.nome,
        preco: parseFloat(produtoEditando.preco),
        quantidadeInicial: parseInt(produtoEditando.quantidade) || 0,
        observacao: produtoEditando.observacao || undefined,
      });
      setModalEditarProduto({ isOpen: false, produto: null });
      setProdutoEditando({ nome: '', preco: '', quantidade: '', observacao: '' });
    }
  }

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
              <h1 className="text-xl font-bold text-gray-900">Cadastros</h1>
              <p className="text-sm text-gray-600">Gerenciar clientes e produtos</p>
            </div>
          </div>

          {/* Navegação das Abas */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setAbaAtiva('clientes')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                abaAtiva === 'clientes'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={18} />
              <span>Clientes</span>
              {clientes.length > 0 && (
                <span
                  className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                    abaAtiva === 'clientes'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {clientes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setAbaAtiva('produtos')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                abaAtiva === 'produtos'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package size={18} />
              <span>Produtos</span>
              {espetinhos.length > 0 && (
                <span
                  className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                    abaAtiva === 'produtos'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {espetinhos.length}
                </span>
              )}
            </button>
          </div>

          {/* Botão Adicionar */}
          <button
            onClick={() =>
              abaAtiva === 'clientes' ? setModalNovoCliente(true) : setModalNovoProduto(true)
            }
            className={`w-full py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 ${
              abaAtiva === 'clientes'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Plus size={20} />
            {abaAtiva === 'clientes' ? 'Adicionar Cliente' : 'Adicionar Produto'}
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6" data-scroll-container>
          {abaAtiva === 'clientes' && (
            <div>
              {clientes.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Users size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhum cliente cadastrado
                  </h3>
                  <p className="text-gray-500">Adicione clientes para acompanhar suas compras</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientes.map((cliente) => {
                    const vendasCliente = getVendasCliente(cliente.id);
                    const totalGasto = vendasCliente.reduce(
                      (total, venda) => total + venda.valorTotal,
                      0,
                    );

                    return (
                      <div
                        key={cliente.id}
                        className="bg-white rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{cliente.nome}</h3>
                            <div className="space-y-1">
                              {cliente.telefone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone size={14} />
                                  <span>{cliente.telefone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ShoppingBag size={14} />
                                <span>{vendasCliente.length} compras</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              R$ {totalGasto.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">total gasto</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => verDetalhesCliente(cliente)}
                            className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => abrirEdicaoCliente(cliente)}
                            className="py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Editar
                          </button>
                          <button
                            onClick={() => confirmarRemocaoCliente(cliente)}
                            className="py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {abaAtiva === 'produtos' && (
            <div>
              {espetinhos.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhum produto cadastrado
                  </h3>
                  <p className="text-gray-500">Adicione produtos para começar as vendas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {espetinhos.map((produto) => (
                    <div
                      key={produto.id}
                      className="bg-white rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{produto.nome}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="font-medium text-green-600">
                              R$ {produto.preco.toFixed(2)}
                            </span>
                            <span>Padrão: {produto.quantidadeInicial || 0} unidades</span>
                          </div>
                          {produto.observacao && (
                            <p className="text-xs text-gray-500 italic">"{produto.observacao}"</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            R$ {produto.preco.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">preço unitário</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicaoProduto(produto)}
                          className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit2 size={14} />
                          Editar
                        </button>
                        <button
                          onClick={() => onRemoverEspetinho(produto.id)}
                          className="py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Cliente */}
      <Modal
        isOpen={modalNovoCliente}
        onClose={() => setModalNovoCliente(false)}
        title="Adicionar Cliente"
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
              onChange={(e) => setNovoClienteForm({ ...novoClienteForm, telefone: e.target.value })}
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
              Adicionar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Cliente */}
      <Modal
        isOpen={modalEditarCliente.isOpen}
        onClose={() => setModalEditarCliente({ isOpen: false, cliente: null })}
        title="Editar Cliente"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente *
            </label>
            <input
              type="text"
              value={clienteEditando.nome}
              onChange={(e) => setClienteEditando({ ...clienteEditando, nome: e.target.value })}
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
              value={clienteEditando.telefone}
              onChange={(e) => setClienteEditando({ ...clienteEditando, telefone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalEditarCliente({ isOpen: false, cliente: null })}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={salvarEdicaoCliente}
              disabled={!clienteEditando.nome.trim()}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalhes do Cliente */}
      <Modal
        isOpen={modalDetalhesCliente.isOpen}
        onClose={() => setModalDetalhesCliente({ isOpen: false, cliente: null })}
        title="Detalhes do Cliente"
      >
        {modalDetalhesCliente.cliente && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {modalDetalhesCliente.cliente.nome}
              </h3>

              <div className="space-y-3 text-sm text-gray-600">
                {modalDetalhesCliente.cliente.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{modalDetalhesCliente.cliente.telefone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    Cliente desde {formatarDataHora(modalDetalhesCliente.cliente.dataCadastro)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>
                    Total gasto: R$ {modalDetalhesCliente.cliente.totalCompras.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Histórico de Compras</h4>

              {(() => {
                const vendasCliente = getVendasCliente(modalDetalhesCliente.cliente.id);

                if (vendasCliente.length === 0) {
                  return (
                    <p className="text-gray-500 text-center py-4">Nenhuma compra realizada ainda</p>
                  );
                }

                return (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {vendasCliente.map((venda) => (
                      <div key={venda.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{venda.nomeEspetinho}</p>
                            <p className="text-sm text-gray-600">
                              {venda.quantidade} unidades • {formatarDataHora(venda.dataHora)}
                            </p>
                          </div>
                          <p className="font-bold text-blue-600">
                            R$ {venda.valorTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Novo Produto */}
      <Modal
        isOpen={modalNovoProduto}
        onClose={() => setModalNovoProduto(false)}
        title="Adicionar Produto"
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
              onChange={(e) => setNovoProdutoForm({ ...novoProdutoForm, preco: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade Padrão
            </label>
            <input
              type="number"
              min="0"
              value={novoProdutoForm.quantidade}
              onChange={(e) =>
                setNovoProdutoForm({ ...novoProdutoForm, quantidade: e.target.value })
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
                setNovoProdutoForm({ ...novoProdutoForm, observacao: e.target.value })
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
              Adicionar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Produto */}
      <Modal
        isOpen={modalEditarProduto.isOpen}
        onClose={() => setModalEditarProduto({ isOpen: false, produto: null })}
        title="Editar Produto"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={produtoEditando.nome}
              onChange={(e) => setProdutoEditando({ ...produtoEditando, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Nome do produto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço Unitário *</label>
            <input
              type="number"
              step="0.01"
              value={produtoEditando.preco}
              onChange={(e) => setProdutoEditando({ ...produtoEditando, preco: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Preço unitário (R$)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade Padrão
            </label>
            <input
              type="number"
              min="0"
              value={produtoEditando.quantidade}
              onChange={(e) =>
                setProdutoEditando({ ...produtoEditando, quantidade: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Quantidade inicial padrão"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={produtoEditando.observacao}
              onChange={(e) =>
                setProdutoEditando({ ...produtoEditando, observacao: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Observações sobre o produto"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalEditarProduto({ isOpen: false, produto: null })}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={salvarEdicaoProduto}
              disabled={!produtoEditando.nome || !produtoEditando.preco}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Confirmar Remoção Cliente */}
      {confirmRemoveClient.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Confirmar Remoção</h2>
              <button
                onClick={() => setConfirmRemoveClient({ isOpen: false, cliente: null })}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Fechar</span>✕
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Trash2 size={24} className="text-red-600" />
                  <div className="flex-1">
                    <p className="text-red-800">
                      Tem certeza que deseja remover o cliente{' '}
                      <strong>{confirmRemoveClient.cliente?.nome}</strong>?
                    </p>
                    <p className="text-red-700 text-sm mt-2">Esta ação não pode ser desfeita.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmRemoveClient({ isOpen: false, cliente: null })}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={removerCliente}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Remover Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
