import { Calendar, DollarSign, ShoppingBag, Plus, Eye, Settings } from 'lucide-react';
import { ResumoOperacao } from '../types/ResumoOperacao';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { formatarDiaSemana } from '../functions/formatar-dia-semana';
import { useNavigation } from '../hooks/useNavigation';
import { formatarData } from '../functions/formatar-data';
import { BotaoInstalarPWA } from './InstallPwaButton';

interface TelaInicialProps {
  operacoes: ResumoOperacao[];
  diaIniciado: boolean;
  dataOperacao?: string;
  onVisualizarOperacao: (operacaoId: string) => void;
}

export function TelaInicial({ 
  operacoes, 
  diaIniciado,
  dataOperacao,

  onVisualizarOperacao,
}: TelaInicialProps) {

  useScrollToTop();
  const { navigate } = useNavigation()

  // Ordenar operações por data (mais recente primeiro)
  const operacoesOrdenadas = [...operacoes].sort((a, b) => 
    new Date(b.dataOperacao).getTime() - new Date(a.dataOperacao).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto">
        {/* Header Fixo */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 sticky top-0 z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Controle de Vendas</h1>
            <BotaoInstalarPWA />
            <p className="text-gray-600">Histórico de operações</p>
          </div>
          
          {diaIniciado ? (
            <div className="space-y-3 mt-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-green-900">Caixa em Andamento</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Você tem um caixa aberto desde {dataOperacao ? formatarData(dataOperacao) : 'hoje'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('painel')}
                  className="flex-1 bg-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={24} />
                  Continuar Caixa
                </button>
                
                <button
                  onClick={() => navigate('abertura')}
                  className="flex-1 bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-3"
                >
                  <Plus size={24} />
                  Novo Dia
                </button>
              </div>
              
              <button
                onClick={() => navigate('configuracoes')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-3"
              >
                <Settings size={20} />
                Configurações
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate('configuracoes')}
                className="flex-1 bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-3"
              >
                <Settings size={24} />
                Configurações
              </button>
              
              <button
                onClick={() => navigate('abertura')}
                className="flex-1 bg-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-3"
              >
                <Plus size={24} />
                Iniciar Novo Dia
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {operacoes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma operação registrada</h3>
                <p className="text-gray-500">Inicie seu primeiro dia de vendas</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Operações Anteriores ({operacoes.length})
                </h2>
                
                {operacoesOrdenadas.map((operacao) => (
                  <div key={operacao.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-gray-600" />
                          <h3 className="font-semibold text-gray-900">
                            {formatarData(operacao.dataOperacao)}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 capitalize mb-3">
                          {formatarDiaSemana(operacao.dataOperacao)}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign size={16} className="text-green-600" />
                              <span className="text-sm font-medium text-green-800">Saldo Final</span>
                            </div>
                            <p className="text-lg font-bold text-green-900">
                              R$ {operacao.saldoFinal.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <ShoppingBag size={16} className="text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">Unidades</span>
                            </div>
                            <p className="text-lg font-bold text-orange-900">
                              {operacao.totalUnidadesVendidas}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => onVisualizarOperacao(operacao.id)}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        Visualizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}