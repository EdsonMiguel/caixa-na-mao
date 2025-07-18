import { limparTodosSistema } from "./db/database";
import TelaInicial from "./components/TelaInicial";
import AberturaDelDia from "./components/AberturaDelDia";
import PainelPrincipal from "./components/PainelPrincipal";
import HistoricoVendas from "./components/HistoricoVendas";
import FechamentoDia from "./components/FechamentoDia";
import VisaoPedidos from "./components/VisaoPedidos";
import GerenciarPagamentos from "./components/GerenciarPagamentos";
import TelaCadastros from "./components/TelaCadastros";
import TelaConfiguracoes from "./components/TelaConfiguracoes";
import { useEstadoDia } from "./hooks/useEstadoDia";
import { useEspetinhos } from "./hooks/useEspetinho";
import { useClientes } from "./hooks/useCliente";
import { useConfiguracoes } from "./hooks/useConfiguracoes";
import { v4 as uuid } from "uuid";
import { useOperacoes } from "./hooks/useOperacoes";
import { formatarMoeda } from "./functions/formatar-moeda";
import { EstadoDia } from "./types/EstadoDia";
import { ResumoOperacao } from "./types/ResumoOperacao";
import { Espetinho } from "./types/Espetinho";
import { Venda } from "./types/Venda";
import { Pedido } from "./types/Pedido";
import { MetodoPagamento, Pagamento } from "./types/Pagamento";
import { Cliente } from "./types/Cliente";
import { Configuracoes } from "./types/Configuracoes";
import { Route } from "./components/Route";
import { useNavigation } from "./hooks/useNavigation";
import { useAlert } from "./context/AlertModalContext";
import { useConfirm } from "./context/ConfirmModalContext";
import _ from "lodash";
import { Loading } from "./components/Loading";

const estadoInicialDia: EstadoDia = {
  saldoInicial: 0,
  saldoAtual: 0,
  espetinhos: [],
  vendas: [],
  pedidos: [],
  pagamentos: [],
  clientes: [],
  diaIniciado: false,
  dataOperacao: "",
};

function App() {
  const [estadoDia, setEstadoDia, limparEstadoDia, isLoadingEstado] =
    useEstadoDia(estadoInicialDia);
  const {
    espetinhos: espetinhosPersistentes,
    addEspetinho,
    updateEspetinho,
    removeEspetinho,
    isLoading: isLoadingEspetinhos,
  } = useEspetinhos();
  const {
    clientes: clientesPersistentes,
    addCliente: addClientePersistente,
    updateCliente: updateClientePersistente,
    removeCliente: removeClientePersistente,
    isLoading: isLoadingClientes,
  } = useClientes();
  const {
    operacoes: operacoesAnteriores,
    addOperacao,
    isLoading: isLoadingOperacoes,
  } = useOperacoes();
  const {
    configuracoes,
    updateConfiguracoes,
    isLoading: isLoadingConfiguracoes,
  } = useConfiguracoes();

  const { navigate } = useNavigation();
  const { showAlert } = useAlert();
  const { showConfirm } = useConfirm();


  if (
    isLoadingEstado ||
    isLoadingEspetinhos ||
    isLoadingClientes ||
    isLoadingOperacoes ||
    isLoadingConfiguracoes
  ) {
    return <Loading isLoading />;
  }

  // Definir tela inicial baseada no estado
  // Remover redirecionamento automático para permitir navegação manual

  const iniciarDia = (saldoInicial: number, espetinhos: Espetinho[]) => {
    const dataOperacao = new Date().toISOString();
    const novoEstado: EstadoDia = {
      ...estadoDia,
      saldoInicial,
      saldoAtual: saldoInicial,
      espetinhos,
      vendas: [],
      pedidos: [],
      pagamentos: [],
      clientes: clientesPersistentes,
      diaIniciado: true,
      dataOperacao,
    };
    setEstadoDia(novoEstado);
    navigate("painel");
  };

  const salvarEspetinho = async (
    novoEspetinho: Omit<
      Espetinho,
      | "id"
      | "quantidadeDisponivel"
      | "quantidadeEmPreparo"
      | "quantidadeFinalizada"
    >
  ) => {
    const espetinho: Espetinho = {
      id: uuid(),
      ...novoEspetinho,
      quantidadeDisponivel: 0,
      quantidadeEmPreparo: 0,
      quantidadeFinalizada: 0,
    };
    await addEspetinho(espetinho);
  };

  const removerEspetinho = async (id: string) => {
    await removeEspetinho(id);
  };

  const editarEspetinho = async (
    id: string,
    dados: Omit<
      Espetinho,
      | "id"
      | "quantidadeDisponivel"
      | "quantidadeEmPreparo"
      | "quantidadeFinalizada"
    >
  ) => {
    await updateEspetinho(id, dados);
  };

  const adicionarAoPedidoAberto = (
    espetinhoId: string,
    quantidade: number,
    clienteId?: string,
    observacao?: string
  ) => {
    const espetinho = estadoDia.espetinhos.find((e) => e.id === espetinhoId);
    if (
      !espetinho ||
      (configuracoes.controlarEstoque &&
        quantidade > espetinho.quantidadeDisponivel)
    )
      return;

    const valorTotal = quantidade * espetinho.preco;
    const novoPedidoId = uuid();

    const novaVenda: Venda = {
      id: `${Date.now()}_${espetinhoId}`,
      pedidoId: novoPedidoId,
      espetinhoId,
      nomeEspetinho: espetinho.nome,
      precoUnitario: espetinho.preco,
      quantidade,
      valorTotal,
      dataHora: new Date().toISOString(),
      observacaoEspetinho: espetinho.observacao,
    };

    if (clienteId) {
      const cliente = clientesPersistentes.find((c) => c.id === clienteId);
      if (cliente) {
        novaVenda.clienteId = cliente.id;
        novaVenda.nomeCliente = cliente.nome;
      }
    }

    const clienteCompleto = clienteId
      ? clientesPersistentes.find((c) => c.id === clienteId)
      : null;

    const novoPedido: Pedido = {
      id: novoPedidoId,
      clienteId: clienteId,
      nomeCliente: clienteId
        ? clientesPersistentes.find((c) => c.id === clienteId)?.nome
        : undefined,
      telefoneCliente: clienteCompleto?.telefone,
      observacao: observacao,
      itens: [novaVenda],
      valorTotal,
      dataHora: new Date().toISOString(),
      status: "aguardando-preparo",
    };

    const espetinhosAtualizados = estadoDia.espetinhos.map((esp) =>
      esp.id === espetinhoId
        ? {
            ...esp,
            quantidadeDisponivel: configuracoes.controlarEstoque
              ? esp.quantidadeDisponivel - quantidade
              : esp.quantidadeDisponivel,
          }
        : esp
    );

    setEstadoDia({
      ...estadoDia,
      saldoAtual: estadoDia.saldoAtual + valorTotal,
      espetinhos: espetinhosAtualizados,
      vendas: [...estadoDia.vendas, novaVenda],
      pedidos: [...estadoDia.pedidos, novoPedido],
    });
  };

  const cancelarPedidoAguardando = async (pedidoId: string) => {
    const pedido = estadoDia.pedidos.find((p) => p.id === pedidoId);
    if (!pedido || pedido.status !== "aguardando-preparo") return;

    const nomeCliente = pedido.nomeCliente || "Cliente Balcão";
    const totalItens = pedido.itens.reduce(
      (total, item) => total + item.quantidade,
      0
    );

    showConfirm({
      title: "Cancelar Pedido",
      message: `Tem certeza que deseja cancelar este pedido?\n\nCliente: ${nomeCliente}\nItens: ${totalItens} unidades\nValor:  ${formatarMoeda(
        pedido.valorTotal
      )}\n\nEsta ação não pode ser desfeita e o valor será devolvido do caixa.`,
      type: "danger",
      onConfirm: async () => {
        // Agrupa os itens do pedido por espetinhoId e soma as quantidades
        const quantidadePorEspetinho = _(pedido.itens)
          .groupBy("espetinhoId")
          .mapValues((items) => _.sumBy(items, "quantidade"))
          .value();

        // Atualiza os espetinhos com base nas quantidades a serem devolvidas
        const espetinhosAtualizados = estadoDia.espetinhos.map((esp) => {
          const quantidade = quantidadePorEspetinho[esp.id] || 0;
          return {
            ...esp,
            quantidadeDisponivel: esp.quantidadeDisponivel + quantidade,
          };
        });

        // Remove as vendas e pedidos relacionados
        const vendasAtualizadas = _.filter(
          estadoDia.vendas,
          (v) => v.pedidoId !== pedidoId
        );
        const pedidosAtualizados = _.filter(
          estadoDia.pedidos,
          (p) => p.id !== pedidoId
        );

        // Atualiza total de compras do cliente (se existir)
        if (pedido.clienteId) {
          const cliente = _.find(clientesPersistentes, {
            id: pedido.clienteId,
          });
          if (cliente) {
            await updateClientePersistente(pedido.clienteId, {
              totalCompras: Math.max(
                0,
                cliente.totalCompras - pedido.valorTotal
              ),
            });
          }
        }

        // Atualiza o estado do dia
        setEstadoDia({
          ...estadoDia,
          saldoAtual: estadoDia.saldoAtual - pedido.valorTotal,
          espetinhos: espetinhosAtualizados,
          vendas: vendasAtualizadas,
          pedidos: pedidosAtualizados,
        });
      },
    });
  };

  const entregarPedido = (pedidoId: string) => {
    const pedido = estadoDia.pedidos.find((p) => p.id === pedidoId);
    if (!pedido || pedido.status !== "em-preparo") return;

    const pedidosAtualizados = estadoDia.pedidos.map((p) =>
      p.id === pedidoId
        ? {
            ...p,
            status: "entregue" as const,
            dataEntrega: new Date().toISOString(),
          }
        : p
    );

    const espetinhosAtualizados = estadoDia.espetinhos.map((esp) => {
      const quantidadeDoPedido = pedido.itens
        .filter((item) => item.espetinhoId === esp.id)
        .reduce((total, item) => total + item.quantidade, 0);

      if (quantidadeDoPedido > 0) {
        return {
          ...esp,
          quantidadeEmPreparo: esp.quantidadeEmPreparo - quantidadeDoPedido,
          quantidadeFinalizada: esp.quantidadeFinalizada + quantidadeDoPedido,
        };
      }
      return esp;
    });

    setEstadoDia({
      ...estadoDia,
      espetinhos: espetinhosAtualizados,
      pedidos: pedidosAtualizados,
    });
  };

  const processarPagamento = (
    pedidosIds: string[],
    metodoPagamento: "dinheiro" | "pix" | "cartao-debito" | "cartao-credito"
  ) => {
    const pedidosParaPagar = estadoDia.pedidos.filter(
      (p) => pedidosIds.includes(p.id) && p.status === "entregue"
    );
    if (pedidosParaPagar.length === 0) return;

    const valorTotal = pedidosParaPagar.reduce(
      (total, pedido) => total + pedido.valorTotal,
      0
    );
    const clienteId = pedidosParaPagar[0].clienteId;
    const nomeCliente = pedidosParaPagar[0].nomeCliente;

    const novoPagamento: Pagamento = {
      id: uuid(),
      clienteId,
      nomeCliente,
      pedidosIds,
      valorTotal,
      dataHora: new Date().toISOString(),
      metodoPagamento,
    };

    const pedidosAtualizados = estadoDia.pedidos.map((p) =>
      pedidosIds.includes(p.id)
        ? {
            ...p,
            status: "pago" as const,
            dataPagamento: new Date().toISOString(),
            metodoPagamento,
          }
        : p
    );

    setEstadoDia({
      ...estadoDia,
      pedidos: pedidosAtualizados,
      pagamentos: [...estadoDia.pagamentos, novoPagamento],
    });
  };

  const adicionarCliente = async (nome: string, telefone?: string) => {
    const novoCliente: Cliente = {
      id: uuid(),
      nome,
      telefone,
      dataCadastro: new Date().toISOString(),
      totalCompras: 0,
    };

    await addClientePersistente(novoCliente);
  };

  const editarCliente = async (id: string, nome: string, telefone?: string) => {
    await updateClientePersistente(id, { nome, telefone });
  };

  const removerCliente = async (id: string) => {
    await removeClientePersistente(id);
  };
  const adicionarMaisEspetinhos = (espetinhoId: string, quantidade: number) => {
    const espetinhosAtualizados = estadoDia.espetinhos.map((esp) =>
      esp.id === espetinhoId
        ? {
            ...esp,
            quantidadeDisponivel: esp.quantidadeDisponivel + quantidade,
          }
        : esp
    );

    setEstadoDia({
      ...estadoDia,
      espetinhos: espetinhosAtualizados,
    });
  };

  const iniciarPreparo = (pedidoId: string) => {
    const pedido = estadoDia.pedidos.find((p) => p.id === pedidoId);
    if (!pedido || pedido.status !== "aguardando-preparo") return;

    const pedidosAtualizados = estadoDia.pedidos.map((p) =>
      p.id === pedidoId
        ? {
            ...p,
            status: "em-preparo" as const,
            dataInicioPreparo: new Date().toISOString(),
          }
        : p
    );

    setEstadoDia({
      ...estadoDia,
      pedidos: pedidosAtualizados,
    });
  };

  const visualizarOperacao = (operacaoId: string) => {
    const operacao = operacoesAnteriores.find((op) => op.id === operacaoId);
    if (operacao) {
      navigate("visualizar-operacao");
    }
  };

  const confirmarFechamento = async () => {
    const pedidosNaoPagos = estadoDia.pedidos.filter(
      (p) => p.status !== "pago"
    );

    if (pedidosNaoPagos.length > 0) {
      const mensagem = `Não é possível fechar o dia. Há ${
        pedidosNaoPagos.length
      } pedido(s) pendente(s) de pagamento.\n\nPedidos pendentes:\n${pedidosNaoPagos
        .map(
          (p) =>
            `• ${p.nomeCliente || "Cliente Balcão"} - ${formatarMoeda(
              p.valorTotal
            )} (${
              p.status === "aguardando-preparo"
                ? "Aguardando preparo"
                : p.status === "em-preparo"
                ? "Em preparo"
                : "Entregue"
            })`
        )
        .join("\n")}`;

      showAlert({
        title: "Não é possível fechar o dia",
        message: mensagem,
        type: "warning",
      });
      return;
    }

    const totalUnidadesVendidas = estadoDia.vendas.reduce(
      (total, venda) => total + venda.quantidade,
      0
    );
    const totalReceita = estadoDia.vendas.reduce(
      (total, venda) => total + venda.valorTotal,
      0
    );

    // Resumo detalhado por espetinho
    const resumoEspetinhos = estadoDia.espetinhos
      .map((esp) => {
        const vendasEspetinho = estadoDia.vendas.filter(
          (v) => v.espetinhoId === esp.id
        );
        const quantidadeVendida = vendasEspetinho.reduce(
          (total, v) => total + v.quantidade,
          0
        );
        const receitaGerada = vendasEspetinho.reduce(
          (total, v) => total + v.valorTotal,
          0
        );

        return {
          id: esp.id,
          nome: esp.nome,
          precoVenda: esp.preco,
          quantidadeVendida,
          receitaGerada,
          observacao: esp.observacao,
        };
      })
      .filter((esp) => esp.quantidadeVendida > 0);

    // Resumo detalhado por cliente
    const resumoClientes = clientesPersistentes
      .map((cliente) => {
        const vendasCliente = estadoDia.vendas.filter(
          (v) => v.clienteId === cliente.id
        );
        const totalGasto = vendasCliente.reduce(
          (total, v) => total + v.valorTotal,
          0
        );
        const pedidosCliente = estadoDia.pedidos.filter(
          (p) => p.clienteId === cliente.id
        );

        return {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          totalGasto,
          quantidadePedidos: pedidosCliente.length,
        };
      })
      .filter((cliente) => cliente.totalGasto > 0);

    // Resumo por método de pagamento
    const resumoPagamentos = estadoDia.pagamentos.reduce((acc, pagamento) => {
      const metodo = pagamento.metodoPagamento;
      const existing = acc.find((item) => item.metodoPagamento === metodo);

      if (existing) {
        existing.quantidade += 1;
        existing.valorTotal += pagamento.valorTotal;
      } else {
        acc.push({
          metodoPagamento: metodo,
          quantidade: 1,
          valorTotal: pagamento.valorTotal,
        });
      }

      return acc;
    }, [] as { metodoPagamento: MetodoPagamento; quantidade: number; valorTotal: number }[]);

    const novoResumo: ResumoOperacao = {
      id: uuid(),
      dataOperacao: estadoDia.dataOperacao || new Date().toISOString(),
      saldoFinal: estadoDia.saldoAtual,
      saldoInicial: estadoDia.saldoInicial,
      totalUnidadesVendidas,
      totalVendas: estadoDia.vendas.length,
      totalReceita,
      resumoEspetinhos,
      resumoClientes,
      resumoPagamentos,
    };

    await addOperacao(novoResumo);
    await limparEstadoDia();
    navigate("home");
  };

  const limparTodosDados = async () => {
    try {
      // Limpar estado do dia atual
      await limparEstadoDia();

      // Limpar todos os dados persistentes usando a função do database
      await limparTodosSistema();

      // Resetar configurações para padrão
      const configPadrao: Configuracoes = {
        permitirIniciarSemSaldo: false,
        controlarEstoque: true,
        nomeEmpresa: "",
        chavePix: "",
        dataAtualizacao: new Date().toISOString(),
      };

      await updateConfiguracoes(configPadrao);

      showAlert({
        title: "Dados Limpos",
        message: "Todos os dados do sistema foram removidos com sucesso.",
        type: "success",
      });
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Erro ao limpar dados do sistema.";

      showAlert({
        title: "Erro",
        message: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Route tela="home">
        <TelaInicial
          operacoes={operacoesAnteriores}
          diaIniciado={estadoDia.diaIniciado}
          dataOperacao={estadoDia.dataOperacao}
          onVisualizarOperacao={visualizarOperacao}
        />
      </Route>
      <Route tela="abertura">
        <AberturaDelDia
          espetinhosPersistentes={espetinhosPersistentes}
          clientesPersistentes={clientesPersistentes}
          permitirIniciarSemSaldo={configuracoes.permitirIniciarSemSaldo}
          onIniciarDia={iniciarDia}
          onSalvarEspetinho={salvarEspetinho}
          onRemoverEspetinho={removerEspetinho}
          onEditarEspetinho={editarEspetinho}
        />
      </Route>
      <Route tela="painel">
        <PainelPrincipal
          saldoAtual={estadoDia.saldoAtual}
          espetinhos={estadoDia.espetinhos}
          clientes={clientesPersistentes}
          pedidos={estadoDia.pedidos}
          controlarEstoque={configuracoes.controlarEstoque}
          onAdicionarAoPedidoAberto={adicionarAoPedidoAberto}
          onIniciarPreparo={iniciarPreparo}
          onEntregarPedido={entregarPedido}
          onAdicionarMaisEspetinhos={adicionarMaisEspetinhos}
          onAdicionarCliente={adicionarCliente}
          onCancelarPedidoAguardando={cancelarPedidoAguardando}
          onEditarEspetinho={editarEspetinho}
          onSalvarEspetinho={salvarEspetinho}
        />
      </Route>
      <Route tela="historico">
        <HistoricoVendas vendas={estadoDia.vendas} />
      </Route>
      <Route tela="fechamento">
        <FechamentoDia
          saldoInicial={estadoDia.saldoInicial}
          saldoAtual={estadoDia.saldoAtual}
          vendas={estadoDia.vendas}
          espetinhos={estadoDia.espetinhos}
          pagamentos={estadoDia.pagamentos}
          onConfirmarFechamento={confirmarFechamento}
        />
      </Route>

      <Route tela="pedidos">
        <VisaoPedidos pedidos={estadoDia.pedidos} />
      </Route>
      <Route tela="pagamentos">
        <GerenciarPagamentos
          pedidos={estadoDia.pedidos}
          pagamentos={estadoDia.pagamentos}
          configuracoes={configuracoes}
          onProcessarPagamento={processarPagamento}
        />
      </Route>
      <Route tela="cadastros">
        <TelaCadastros
          espetinhos={espetinhosPersistentes}
          onSalvarEspetinho={salvarEspetinho}
          onEditarEspetinho={editarEspetinho}
          onRemoverEspetinho={removerEspetinho}
          clientes={clientesPersistentes}
          onAdicionarCliente={adicionarCliente}
          onEditarCliente={editarCliente}
          onRemoverCliente={removerCliente}
          vendas={estadoDia.vendas}
        />
      </Route>
      <Route tela="configuracoes">
        <TelaConfiguracoes
          configuracoes={configuracoes}
          onSalvarConfiguracoes={updateConfiguracoes}
          onLimparTodosDados={limparTodosDados}
        />
      </Route>
      <Route tela="home">
        <TelaInicial
          diaIniciado={estadoDia.diaIniciado}
          onVisualizarOperacao={visualizarOperacao}
          operacoes={operacoesAnteriores}
        />
      </Route>
    </div>
  );
}

export default App;
