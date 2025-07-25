import { useEffect, useState } from "react";
import { estadoDiaManager } from "../db/database";
import { EstadoDia } from "../types/EstadoDia";

export function useEstadoDia(initialValue: EstadoDia) {
  const [estado, setEstado] = useState<EstadoDia>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEstado() {
      try {
        const savedEstado = await estadoDiaManager.get();
        if (savedEstado) {
          setEstado(savedEstado);
        }
      } catch (error) {
        console.error('Erro ao carregar estado do dia:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEstado();
  }, []);

  const updateEstado = async (novoEstado: EstadoDia | ((prev: EstadoDia) => EstadoDia)) => {
    try {
      const estadoAtualizado = typeof novoEstado === 'function' ? novoEstado(estado) : novoEstado;
      await estadoDiaManager.set(estadoAtualizado);
      setEstado(estadoAtualizado);
    } catch (error) {
      console.error('Erro ao salvar estado do dia:', error);
    }
  };

  async function clearEstado() {
    try {
      await estadoDiaManager.clear();
      setEstado(initialValue);
    } catch (error) {
      console.error('Erro ao limpar estado do dia:', error);
    }
  };

  return [estado, updateEstado, clearEstado, isLoading] as const;
}