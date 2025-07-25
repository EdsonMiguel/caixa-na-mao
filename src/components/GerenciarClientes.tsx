import { useState } from "react";
import {
  ArrowLeft,
  Users,
  Plus,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  Edit2,
} from "lucide-react";
import {Modal} from "./Modal";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Cliente } from "../types/Cliente";
import { Venda } from "../types/Venda";
import { formatarDataHora } from "../functions/formatar-data-hora";
import { useNavigation } from "../hooks/useNavigation";
import { TextField } from "./TextField";

interface GerenciarClientesProps {
  clientes: Cliente[];
  vendas: Venda[];
  onAdicionarCliente: (nome: string, telefone?: string) => void;
  onEditarCliente: (id: string, nome: string, telefone?: string) => void;
}

export function GerenciarClientes({
  clientes,
  vendas,
  onAdicionarCliente,
  onEditarCliente,
}: GerenciarClientesProps) {
  useScrollToTop();

  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [modalDetalhesCliente, setModalDetalhesCliente] = useState<{
    isOpen: boolean;
    cliente: Cliente | null;
  }>({
    isOpen: false,
    cliente: null,
  });
  const [modalEditarCliente, setModalEditarCliente] = useState<{
    isOpen: boolean;
    cliente: Cliente | null;
  }>({
    isOpen: false,
    cliente: null,
  });
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [clienteEditando, setClienteEditando] = useState({
    nome: "",
    telefone: "",
  });

  const { navigate } = useNavigation();

  function adicionarCliente() {
    if (nomeCliente.trim()) {
      onAdicionarCliente(
        nomeCliente.trim(),
        telefoneCliente.trim() || undefined
      );
      setNomeCliente("");
      setTelefoneCliente("");
      setModalNovoCliente(false);
    }
  };

  function verDetalhesCliente(cliente: Cliente) {
    setModalDetalhesCliente({ isOpen: true, cliente });
  };

  function abrirEdicaoCliente(cliente: Cliente) {
    setClienteEditando({
      nome: cliente.nome,
      telefone: cliente.telefone || "",
    });
    setModalEditarCliente({ isOpen: true, cliente });
  };

  function salvarEdicaoCliente() {
    if (modalEditarCliente.cliente && clienteEditando.nome.trim()) {
      onEditarCliente(
        modalEditarCliente.cliente.id,
        clienteEditando.nome.trim(),
        clienteEditando.telefone.trim() || undefined
      );
      setModalEditarCliente({ isOpen: false, cliente: null });
      setClienteEditando({ nome: "", telefone: "" });
    }
  };

  function getVendasCliente(clienteId: string) {
    return vendas.filter((venda) => venda.clienteId === clienteId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-lg mx-auto">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("painel")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gerenciar Clientes
              </h1>
              <p className="text-sm text-gray-600">
                Cadastro e histórico de clientes
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalNovoCliente(true)}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar Cliente
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6" data-scroll-container>
          {clientes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum cliente cadastrado
              </h3>
              <p className="text-gray-500">
                Adicione clientes para acompanhar suas compras
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientes.map((cliente) => {
                const vendasCliente = getVendasCliente(cliente.id);
                const totalGasto = vendasCliente.reduce(
                  (total, venda) => total + venda.valorTotal,
                  0
                );

                return (
                  <div
                    key={cliente.id}
                    className="bg-white rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {cliente.nome}
                        </h3>
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
                        <p className="text-lg font-bold text-orange-600">
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
                    </div>
                  </div>
                );
              })}
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
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Digite o nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone (opcional)
            </label>
            <input
              type="tel"
              value={telefoneCliente}
              onChange={(e) => setTelefoneCliente(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              onClick={adicionarCliente}
              disabled={!nomeCliente.trim()}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalhes do Cliente */}
      <Modal
        isOpen={modalDetalhesCliente.isOpen}
        onClose={() =>
          setModalDetalhesCliente({ isOpen: false, cliente: null })
        }
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
                    Cliente desde{" "}
                    {formatarDataHora(
                      modalDetalhesCliente.cliente.dataCadastro
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>
                    Total gasto: R${" "}
                    {modalDetalhesCliente.cliente.totalCompras.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Histórico de Compras
              </h4>

              {(() => {
                const vendasCliente = getVendasCliente(
                  modalDetalhesCliente.cliente.id
                );

                if (vendasCliente.length === 0) {
                  return (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma compra realizada ainda
                    </p>
                  );
                }

                return (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {vendasCliente.map((venda) => (
                      <div key={venda.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {venda.nomeEspetinho}
                            </p>
                            <p className="text-sm text-gray-600">
                              {venda.quantidade} unidades •{" "}
                              {formatarDataHora(venda.dataHora)}
                            </p>
                          </div>
                          <p className="font-bold text-orange-600">
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

      {/* Modal Editar Cliente */}
      <Modal
        isOpen={modalEditarCliente.isOpen}
        onClose={() => setModalEditarCliente({ isOpen: false, cliente: null })}
        title="Editar Cliente"
      >
        <div className="space-y-4">
          <TextField
            type="text"
            value={clienteEditando.nome}
            onChange={(e) =>
              setClienteEditando({ ...clienteEditando, nome: e.target.value })
            }
            placeholder="Digite o nome"
            label="Nome do Cliente *"
          />

            <TextField
              type="tel"
              label="Telefone (opcional)"
              
              value={clienteEditando.telefone}
              onChange={(e) =>
                setClienteEditando({
                  ...clienteEditando,
                  telefone: e.target.value,
                })
              }
              placeholder="(11) 99999-9999"
            />
          

          <div className="flex gap-3 pt-4">
            <button
              onClick={() =>
                setModalEditarCliente({ isOpen: false, cliente: null })
              }
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
    </div>
  );
}
