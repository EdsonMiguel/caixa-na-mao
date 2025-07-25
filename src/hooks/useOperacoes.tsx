import { useEffect, useState } from "react";
import { ResumoOperacao } from "../types/ResumoOperacao";
import { operacoesManager } from "../db/database";

export function useOperacoes() {
  const [operacoes, setOperacoes] = useState<ResumoOperacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOperacoes() {
      try {
        const savedOperacoes = await operacoesManager.getAll();
        setOperacoes(savedOperacoes);
      } catch (error) {
        console.error('Erro ao carregar operações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOperacoes();
  }, []);

  async function addOperacao(operacao: ResumoOperacao) {
    try {
      await operacoesManager.add(operacao);
      setOperacoes(prev => [operacao, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar operação:', error);
    }
  };

  async function removeOperacao(id: string) {
    try {
      await operacoesManager.remove(id);
      setOperacoes(prev => prev.filter(op => op.id !== id));
    } catch (error) {
      console.error('Erro ao remover operação:', error);
    }
  };

  async function clearOperacoes() {
    try {
      await operacoesManager.clear();
      setOperacoes([]);
    } catch (error) {
      console.error('Erro ao limpar operações:', error);
    }
  };

  return {
    operacoes,
    addOperacao,
    removeOperacao,
    clearOperacoes,
    isLoading
  };
}
