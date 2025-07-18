import { useEffect, useState } from 'react';
import { espetinhosManager } from '../db/database'
import { Espetinho } from '../types/Espetinho';

export function useEspetinhos() {
  const [espetinhos, setEspetinhos] = useState<Espetinho[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEspetinhos = async () => {
      try {
        const savedEspetinhos = await espetinhosManager.getAll();
        setEspetinhos(savedEspetinhos);
      } catch (error) {
        console.error('Erro ao carregar espetinhos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEspetinhos();
  }, []);

  const addEspetinho = async (espetinho: Espetinho) => {
    try {
      await espetinhosManager.add(espetinho);
      setEspetinhos(prev => [...prev, espetinho]);
    } catch (error) {
      console.error('Erro ao adicionar espetinho:', error);
    }
  };

  const updateEspetinho = async (id: string, dados: Partial<Espetinho>) => {
    try {
      await espetinhosManager.update(id, dados);
      setEspetinhos(prev => prev.map(esp => esp.id === id ? { ...esp, ...dados } : esp));
    } catch (error) {
      console.error('Erro ao atualizar espetinho:', error);
    }
  };

  const removeEspetinho = async (id: string) => {
    try {
      await espetinhosManager.remove(id);
      setEspetinhos(prev => prev.filter(esp => esp.id !== id));
    } catch (error) {
      console.error('Erro ao remover espetinho:', error);
    }
  };

  const setAllEspetinhos = async (novosEspetinhos: Espetinho[]) => {
    try {
      await espetinhosManager.setAll(novosEspetinhos);
      setEspetinhos(novosEspetinhos);
    } catch (error) {
      console.error('Erro ao definir todos os espetinhos:', error);
    }
  };

  return {
    espetinhos,
    addEspetinho,
    updateEspetinho,
    removeEspetinho,
    setAllEspetinhos,
    isLoading
  };
}