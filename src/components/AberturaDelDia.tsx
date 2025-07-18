import { useState } from "react";
import {
  Plus,
  Trash2,
  DollarSign,
  Settings,
  Edit2,
  ArrowLeft,
} from "lucide-react";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { formatarMoeda } from "../functions/formatar-moeda";
import { Espetinho } from "../types/Espetinho";
import { Cliente } from "../types/Cliente";
import { TextField } from "./TextField";

interface AberturaDoDiaProps {
  espetinhosPersistentes: Espetinho[];
  clientesPersistentes: Cliente[];
  permitirIniciarSemSaldo: boolean;
  onIniciarDia: (saldoInicial: number, espetinhos: Espetinho[]) => void;
  onSalvarEspetinho: (
    espetinho: Omit<
      Espetinho,
      | "id"
      | "quantidadeDisponivel"
      | "quantidadeEmPreparo"
      | "quantidadeFinalizada"
    >
  ) => void;
  onRemoverEspetinho: (id: string) => void;
  onEditarEspetinho: (
    id: string,
    dados: Omit<
      Espetinho,
      | "id"
      | "quantidadeDisponivel"
      | "quantidadeEmPreparo"
      | "quantidadeFinalizada"
    >
  ) => void;
}

interface NovoEspetinho {
  nome: string;
  preco: string;
  quantidade: string;
  observacao: string;
}

export default function AberturaDoDia({
  espetinhosPersistentes,
  clientesPersistentes,
  permitirIniciarSemSaldo,
  onIniciarDia,
  onSalvarEspetinho,
  onRemoverEspetinho,
  onEditarEspetinho,
}: AberturaDoDiaProps) {
  useScrollToTop();

  const [saldoInicial, setSaldoInicial] = useState("");
  const [novoEspetinho, setNovoEspetinho] = useState<NovoEspetinho>({
    nome: "",
    preco: "",
    quantidade: "",
    observacao: "",
  });
  const [quantidadesIniciais, setQuantidadesIniciais] = useState<
    Record<string, string>
  >({});
  const [modalEditarProduto, setModalEditarProduto] = useState<{
    isOpen: boolean;
    produto: Espetinho | null;
  }>({
    isOpen: false,
    produto: null,
  });
  const [produtoEditando, setProdutoEditando] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    observacao: "",
  });

  const adicionarEspetinho = () => {
    if (novoEspetinho.nome && novoEspetinho.preco) {
      onSalvarEspetinho({
        nome: novoEspetinho.nome,
        preco: parseFloat(novoEspetinho.preco),
        quantidadeInicial: parseInt(novoEspetinho.quantidade) || 0,
        observacao: novoEspetinho.observacao || undefined,
      });
      setNovoEspetinho({ nome: "", preco: "", quantidade: "", observacao: "" });
    }
  };

  const removerEspetinhoPersistente = (id: string) => {
    onRemoverEspetinho(id);
  };

  const abrirEdicaoProduto = (produto: Espetinho) => {
    setProdutoEditando({
      nome: produto.nome,
      preco: produto.preco.toString(),
      quantidade: (produto.quantidadeInicial || 0).toString(),
      observacao: produto.observacao || "",
    });
    setModalEditarProduto({ isOpen: true, produto });
  };

  const salvarEdicaoProduto = () => {
    if (
      modalEditarProduto.produto &&
      produtoEditando.nome &&
      produtoEditando.preco
    ) {
      onEditarEspetinho(modalEditarProduto.produto.id, {
        nome: produtoEditando.nome,
        preco: parseFloat(produtoEditando.preco),
        quantidadeInicial: parseInt(produtoEditando.quantidade) || 0,
        observacao: produtoEditando.observacao || undefined,
      });
      setModalEditarProduto({ isOpen: false, produto: null });
      setProdutoEditando({
        nome: "",
        preco: "",
        quantidade: "",
        observacao: "",
      });
    }
  };

  const iniciarDia = () => {
    if (
      (saldoInicial || permitirIniciarSemSaldo) &&
      espetinhosPersistentes.length > 0
    ) {
      const espetinhosFormatados: Espetinho[] = espetinhosPersistentes.map(
        (esp) => ({
          ...esp,
          quantidadeDisponivel: quantidadesIniciais[esp.id]
            ? parseInt(quantidadesIniciais[esp.id])
            : esp.quantidadeInicial || 0,
          quantidadeEmPreparo: 0,
          quantidadeFinalizada: 0,
        })
      );

      onIniciarDia(parseFloat(saldoInicial) || 0, espetinhosFormatados);
    }
  };

  const updateQuantidadeInicial = (espetinhoId: string, quantidade: string) => {
    setQuantidadesIniciais((prev) => ({
      ...prev,
      [espetinhoId]: quantidade,
    }));
  };

  const podeIniciar =
    (saldoInicial || permitirIniciarSemSaldo) &&
    espetinhosPersistentes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-lg mx-auto">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Configuração do Dia
              </h1>
              <p className="text-sm text-gray-600">
                Configure seu caixa e produtos para iniciar as operações
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="text-white" size={28} />
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Saldo Inicial */}
          {!permitirIniciarSemSaldo && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-orange-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Saldo Inicial
                  </h2>
                  <p className="text-sm text-gray-600">
                    Valor em caixa para iniciar o dia
                  </p>
                </div>
              </div>
              <TextField
                type="number"
                step="0.01"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                placeholder="0,00"
              />
            </div>
          )}

          {permitirIniciarSemSaldo && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-green-900">
                    Modo Sem Saldo Inicial
                  </h2>
                  <p className="text-sm text-green-700">
                    O dia será iniciado com saldo R$ 0,00
                  </p>
                </div>
              </div>
              <p className="text-xs text-green-600">
                ✓ Configuração ativa: Permitir iniciar dia sem saldo
              </p>
            </div>
          )}

          {/* Dados Persistentes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Dados Cadastrados
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {espetinhosPersistentes.length}
                </div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {clientesPersistentes.length}
                </div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
            </div>
          </div>

          {/* Espetinhos Cadastrados */}
          {espetinhosPersistentes.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Produtos Cadastrados
              </h3>
              <div className="space-y-4">
                {espetinhosPersistentes.map((esp) => (
                  <div
                    key={esp.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {esp.nome}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatarMoeda(esp.preco)}
                        </p>
                        {esp.observacao && (
                          <p className="text-xs text-gray-500 mt-1">
                            {esp.observacao}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicaoProduto(esp)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => removerEspetinhoPersistente(esp.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade inicial para hoje
                      </label>
                      <TextField
                        type="number"
                        min="0"
                        value={
                          quantidadesIniciais[esp.id] !== undefined
                            ? quantidadesIniciais[esp.id]
                            : esp.quantidadeInicial || ""
                        }
                        onChange={(e) =>
                          updateQuantidadeInicial(esp.id, e.target.value)
                        }
                        placeholder="0 (deixe 0 se não tiver hoje)"
                      />
                      {quantidadesIniciais[esp.id] === "0" && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          Este produto não aparecerá na lista de disponíveis
                          hoje
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cadastrar Novo Espetinho */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Cadastrar Novo Produto
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                value={novoEspetinho.nome}
                onChange={(e) =>
                  setNovoEspetinho({ ...novoEspetinho, nome: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nome do produto"
              />

              <input
                type="number"
                step="0.01"
                value={novoEspetinho.preco}
                onChange={(e) =>
                  setNovoEspetinho({ ...novoEspetinho, preco: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Preço unitário (R$)"
              />

              <input
                type="number"
                min="0"
                value={novoEspetinho.quantidade}
                onChange={(e) =>
                  setNovoEspetinho({
                    ...novoEspetinho,
                    quantidade: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Quantidade padrão (deixe vazio para 0)"
              />

              <textarea
                value={novoEspetinho.observacao}
                onChange={(e) =>
                  setNovoEspetinho({
                    ...novoEspetinho,
                    observacao: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Observações (opcional)"
                rows={2}
              />

              <button
                onClick={adicionarEspetinho}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Salvar Produto
              </button>
            </div>
          </div>

          {/* Botão Iniciar Dia */}
          <div className="pb-6">
            <button
              onClick={iniciarDia}
              disabled={!podeIniciar}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                podeIniciar
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Iniciar Operações
            </button>
          </div>
        </div>
      </div>

      {/* Modal Editar Produto */}
      {modalEditarProduto.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Editar Produto
              </h2>
              <button
                onClick={() =>
                  setModalEditarProduto({ isOpen: false, produto: null })
                }
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Fechar</span>✕
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={produtoEditando.nome}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        nome: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Nome do produto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço Unitário *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={produtoEditando.preco}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        preco: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      setProdutoEditando({
                        ...produtoEditando,
                        quantidade: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Quantidade inicial padrão"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={produtoEditando.observacao}
                    onChange={(e) =>
                      setProdutoEditando({
                        ...produtoEditando,
                        observacao: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Observações sobre o produto"
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      setModalEditarProduto({ isOpen: false, produto: null })
                    }
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarEdicaoProduto}
                    disabled={!produtoEditando.nome || !produtoEditando.preco}
                    className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
