import { useState } from 'react';
import { ArrowLeft, Settings, Save, ToggleLeft, ToggleRight, Trash2, AlertTriangle, Building, CreditCard } from 'lucide-react';
import { Configuracoes } from '../types/Configuracoes';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAlert } from '../context/AlertModalContext';
import { useConfirm } from '../context/ConfirmModalContext';
import { useNavigation } from '../hooks/useNavigation';

interface TelaConfiguracoesProps {
  configuracoes: Configuracoes;
  onSalvarConfiguracoes: (configuracoes: Configuracoes) => void;
  onLimparTodosDados: () => void;
}

export function TelaConfiguracoes({
  configuracoes,
  onSalvarConfiguracoes,
  onLimparTodosDados
}: TelaConfiguracoesProps) {
  useScrollToTop();

  const [configLocal, setConfigLocal] = useState<Configuracoes>(configuracoes);
  const { showAlert } = useAlert()
  const { showConfirm } = useConfirm()
  const { navigate } = useNavigation()

  function togglePermitirIniciarSemSaldo() {
    setConfigLocal(prev => ({
      ...prev,
      permitirIniciarSemSaldo: !prev.permitirIniciarSemSaldo
    }));
  };

  function toggleControlarEstoque() {
    setConfigLocal(prev => ({
      ...prev,
      controlarEstoque: !prev.controlarEstoque
    }));
  };

  function salvarConfiguracoes() {
    onSalvarConfiguracoes(configLocal);
    showAlert({
      title: 'Configurações Salvas',
      message: 'As configurações foram salvas com sucesso!',
      type: 'success'
    });
  };

  function confirmarLimpezaDados() {
    showConfirm({
      title: 'ATENÇÃO: Limpar Todos os Dados',
      message: `Esta ação irá APAGAR PERMANENTEMENTE todos os dados do sistema:

• Todos os produtos cadastrados
• Todos os clientes cadastrados  
• Todo o histórico de operações anteriores
• Todas as configurações personalizadas

⚠️ ESTA AÇÃO NÃO PODE SER DESFEITA!

Tem certeza que deseja continuar?`,
      type: 'danger',
      onConfirm: () => {
        onLimparTodosDados();
      }
    });
  };

  const temAlteracoes = 
    configLocal.permitirIniciarSemSaldo !== configuracoes.permitirIniciarSemSaldo ||
    configLocal.controlarEstoque !== configuracoes.controlarEstoque ||
    configLocal.nomeEmpresa !== configuracoes.nomeEmpresa ||
    configLocal.chavePix !== configuracoes.chavePix;

  function formatarData(dataISO: string) {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-lg mx-auto">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('home')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
              <p className="text-sm text-gray-600">Personalize o comportamento do sistema</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Settings size={24} />
              <div>
                <p className="text-purple-100 text-sm font-medium">Sistema de Configurações</p>
                <p className="text-lg font-bold">Parâmetros Gerais</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-scroll-container>
          
          {/* Informações da Empresa */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={20} className="text-blue-600" />
              Informações da Empresa
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={configLocal.nomeEmpresa}
                  onChange={(e) => setConfigLocal(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite o nome da sua empresa"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nome que aparecerá nos relatórios e documentos
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard size={16} />
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={configLocal.chavePix}
                  onChange={(e) => setConfigLocal(prev => ({ ...prev, chavePix: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite sua chave PIX (CPF, CNPJ, e-mail ou telefone)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chave PIX para recebimento de pagamentos
                </p>
              </div>
            </div>
          </div>

          {/* Configuração: Iniciar sem Saldo */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Permitir Iniciar Dia sem Saldo
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Quando ativado, permite iniciar o dia sem informar o saldo inicial. 
                  O saldo será considerado como R$ 0,00.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    <strong>Ativado:</strong> Não solicita saldo inicial<br/>
                    <strong>Desativado:</strong> Obrigatório informar saldo inicial
                  </p>
                </div>
              </div>
              
              <button
                onClick={togglePermitirIniciarSemSaldo}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  configLocal.permitirIniciarSemSaldo
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {configLocal.permitirIniciarSemSaldo ? (
                  <>
                    <ToggleRight size={20} />
                    <span>Ativado</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={20} />
                    <span>Desativado</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuração: Controlar Estoque */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Controlar Estoque
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Quando ativado, controla a quantidade disponível dos produtos. 
                  Quando desativado, permite vendas ilimitadas.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    <strong>Ativado:</strong> Controla quantidade, exibe botão estoque<br/>
                    <strong>Desativado:</strong> Vendas ilimitadas, sem controle de quantidade
                  </p>
                </div>
              </div>
              
              <button
                onClick={toggleControlarEstoque}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  configLocal.controlarEstoque
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {configLocal.controlarEstoque ? (
                  <>
                    <ToggleRight size={20} />
                    <span>Ativado</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={20} />
                    <span>Desativado</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Sistema
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Última Atualização:</span>
                <span className="font-medium text-gray-900">
                  {formatarData(configuracoes.dataAtualizacao)}
                </span>
              </div>
              
              {configuracoes.nomeEmpresa && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Empresa:</span>
                  <span className="font-medium text-gray-900">
                    {configuracoes.nomeEmpresa}
                  </span>
                </div>
              )}
              
              {configuracoes.chavePix && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">PIX Configurado:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Sim
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Versão do Sistema:</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Operacional
                </span>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trash2 size={20} className="text-red-600" />
              Zona de Perigo
            </h3>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Limpar Todos os Dados</h4>
                  <p className="text-red-800 text-sm mb-3">
                    Remove permanentemente todos os dados do sistema: produtos, clientes, 
                    histórico de operações e configurações.
                  </p>
                  <p className="text-red-700 text-xs font-medium">
                    ⚠️ Esta ação não pode ser desfeita!
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={confirmarLimpezaDados}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Limpar Todos os Dados
            </button>
          </div>

          {/* Botão Salvar Configurações */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {temAlteracoes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Você tem alterações não salvas. Clique em "Salvar Configurações" para aplicá-las.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('home')}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={salvarConfiguracoes}
                disabled={!temAlteracoes}
                className="flex-1 py-3 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}