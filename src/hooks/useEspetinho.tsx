import { useEffect, useState } from 'react';
import { espetinhosManager } from '../db/database';
import { Espetinho } from '../types/Espetinho';

export function useEspetinhos() {
  const [espetinhos, setEspetinhos] = useState<Espetinho[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEspetinhos() {
      try {
        const savedEspetinhos = await espetinhosManager.getAll();
        setEspetinhos(savedEspetinhos);
      } catch (error) {
        console.error('Erro ao carregar espetinhos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEspetinhos();
  }, []);

  async function addEspetinho(espetinho: Espetinho) {
    try {
      await espetinhosManager.add(espetinho);
      setEspetinhos((prev) => [...prev, espetinho]);
    } catch (error) {
      console.error('Erro ao adicionar espetinho:', error);
    }
  }

  async function updateEspetinho(id: string, dados: Partial<Espetinho>) {
    try {
      await espetinhosManager.update(id, dados);
      setEspetinhos((prev) => prev.map((esp) => (esp.id === id ? { ...esp, ...dados } : esp)));
    } catch (error) {
      console.error('Erro ao atualizar espetinho:', error);
    }
  }

  async function removeEspetinho(id: string) {
    try {
      await espetinhosManager.remove(id);
      setEspetinhos((prev) => prev.filter((esp) => esp.id !== id));
    } catch (error) {
      console.error('Erro ao remover espetinho:', error);
    }
  }

  async function setAllEspetinhos(novosEspetinhos: Espetinho[]) {
    try {
      await espetinhosManager.setAll(novosEspetinhos);
      setEspetinhos(novosEspetinhos);
    } catch (error) {
      console.error('Erro ao definir todos os espetinhos:', error);
    }
  }

  return {
    espetinhos,
    addEspetinho,
    updateEspetinho,
    removeEspetinho,
    setAllEspetinhos,
    isLoading,
  };
}
