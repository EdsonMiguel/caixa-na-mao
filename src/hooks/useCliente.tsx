import { useEffect, useState } from "react";
import { clientesManager } from "../db/database";
import { Cliente } from "../types/Cliente";

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClientes = async () => {
      try {
        const savedClientes = await clientesManager.getAll();
        setClientes(savedClientes);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientes();
  }, []);

  const addCliente = async (cliente: Cliente) => {
    try {
      await clientesManager.add(cliente);
      setClientes(prev => [...prev, cliente]);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  const updateCliente = async (id: string, dados: Partial<Cliente>) => {
    try {
      await clientesManager.update(id, dados);
      setClientes(prev => prev.map(cli => cli.id === id ? { ...cli, ...dados } : cli));
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const removeCliente = async (id: string) => {
    try {
      await clientesManager.remove(id);
      setClientes(prev => prev.filter(cli => cli.id !== id));
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  const setAllClientes = async (novosClientes: Cliente[]) => {
    try {
      await clientesManager.setAll(novosClientes);
      setClientes(novosClientes);
    } catch (error) {
      console.error('Erro ao definir todos os clientes:', error);
    }
  };

  return {
    clientes,
    addCliente,
    updateCliente,
    removeCliente,
    setAllClientes,
    isLoading
  };
}