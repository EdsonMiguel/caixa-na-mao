import { useEffect, useState } from "react";
import { configuracoesManager } from "../db/database";
import { Configuracoes } from "../types/Configuracoes";

export function useConfiguracoes() {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    permitirIniciarSemSaldo: false,
    controlarEstoque: true,
    nomeEmpresa: '',
    chavePix: '',
    dataAtualizacao: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConfiguracoes() {
      try {
        const savedConfiguracoes = await configuracoesManager.get();
        setConfiguracoes(savedConfiguracoes);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguracoes();
  }, []);

  async function updateConfiguracoes(novasConfiguracoes: Configuracoes) {
    try {
      await configuracoesManager.set(novasConfiguracoes);
      setConfiguracoes(novasConfiguracoes);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  return {
    configuracoes,
    updateConfiguracoes,
    isLoading
  };
}