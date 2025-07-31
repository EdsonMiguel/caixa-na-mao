import { ArrowLeft, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Venda } from '../types/Venda';
import { Espetinho } from '../types/Espetinho';
import { Pagamento } from '../types/Pagamento';
import _ from 'lodash';
import { useNavigation } from '../hooks/useNavigation';
import { formatarMoeda } from '../functions/formatar-moeda';

interface FechamentoDiaProps {
  saldoInicial: number;
  saldoAtual: number;
  vendas: Venda[];
  espetinhos: Espetinho[];
  pagamentos: Pagamento[];
  onConfirmarFechamento: () => void;
}

export function FechamentoDia({
  saldoInicial,
  saldoAtual,
  vendas,

  onConfirmarFechamento,
}: FechamentoDiaProps) {
  useScrollToTop();
  const { navigate } = useNavigation();

  const totalVendido = _.sumBy(vendas, (v) => v?.valorTotal || 0);
  const totalUnidadesVendidas = _.sumBy(vendas, (v) => v?.quantidade || 0);

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
              <h1 className="text-xl font-bold text-gray-900">Fechamento do Dia</h1>
              <p className="text-sm text-gray-600">Resumo das operações</p>
            </div>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-scroll-container>
          {/* Resumo Financeiro */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-orange-600" />
              Resumo Financeiro
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Saldo Inicial:</span>
                <span className="font-semibold text-gray-900">
                  {formatarMoeda(saldoInicial || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Vendido:</span>
                <span className="font-semibold text-orange-600">{formatarMoeda(totalVendido)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Saldo Final:</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatarMoeda(saldoAtual || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo de Vendas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-600" />
              Resumo de Vendas
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <ShoppingBag className="text-orange-600 mx-auto mb-2" size={24} />
                <p className="text-sm text-orange-600 font-medium">Total de Vendas</p>
                <p className="text-xl font-bold text-orange-800">{vendas.length}</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <ShoppingBag className="text-orange-600 mx-auto mb-2" size={24} />
                <p className="text-sm text-orange-600 font-medium">Unidades Vendidas</p>
                <p className="text-xl font-bold text-orange-800">{totalUnidadesVendidas}</p>
              </div>
            </div>
          </div>

          {/* Botão de Confirmação */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ Ao confirmar o fechamento, todos os dados do dia serão salvos e você retornará à
                tela inicial.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('painel')}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={onConfirmarFechamento}
                className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Confirmar Fechamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
