import Dexie, { Table } from 'dexie';
import { EstadoDia } from '../types/EstadoDia';
import { Espetinho } from '../types/Espetinho';
import { Cliente } from '../types/Cliente';
import { ResumoOperacao } from '../types/ResumoOperacao';
import { Configuracoes } from '../types/Configuracoes';


export interface StoredEstadoDia extends EstadoDia {
  id?: number;
}

export interface StoredEspetinho extends Espetinho {
  id: string;
}

export interface StoredCliente extends Cliente {
  id: string;
}

export interface StoredResumoOperacao extends ResumoOperacao {
  id: string;
}

export interface StoredConfiguracoes extends Configuracoes {
  id?: number;
}

export class EspetinhosDatabase extends Dexie {
  estadoDia!: Table<StoredEstadoDia>;
  espetinhos!: Table<StoredEspetinho>;
  clientes!: Table<StoredCliente>;
  operacoes!: Table<StoredResumoOperacao>;
  configuracoes!: Table<StoredConfiguracoes>;

  constructor() {
    super('EspetinhosDatabase');
    
    this.version(2).stores({
      estadoDia: '++id',
      espetinhos: 'id, nome, preco',
      clientes: 'id, nome, telefone, dataCadastro',
      operacoes: 'id, dataOperacao, saldoFinal, saldoInicial, totalReceita',
      configuracoes: '++id, dataAtualizacao'
    });
  }
}

export const db = new EspetinhosDatabase();

// Funções auxiliares para gerenciar o estado do dia
export const estadoDiaManager = {
  async get(): Promise<EstadoDia | null> {
    const estados = await db.estadoDia.toArray();
    return estados.length > 0 ? estados[0] : null;
  },

  async set(estado: EstadoDia): Promise<void> {
    await db.estadoDia.clear();
    await db.estadoDia.add(estado);
  },

  async clear(): Promise<void> {
    await db.estadoDia.clear();
  }
};

// Funções para gerenciar espetinhos persistentes
export const espetinhosManager = {
  async getAll(): Promise<Espetinho[]> {
    return await db.espetinhos.toArray();
  },

  async add(espetinho: Espetinho): Promise<void> {
    await db.espetinhos.put(espetinho);
  },

  async update(id: string, dados: Partial<Espetinho>): Promise<void> {
    await db.espetinhos.update(id, dados);
  },

  async remove(id: string): Promise<void> {
    await db.espetinhos.delete(id);
  },

  async setAll(espetinhos: Espetinho[]): Promise<void> {
    await db.espetinhos.clear();
    await db.espetinhos.bulkAdd(espetinhos);
  }
};

// Funções para gerenciar clientes persistentes
export const clientesManager = {
  async getAll(): Promise<Cliente[]> {
    return await db.clientes.toArray();
  },

  async add(cliente: Cliente): Promise<void> {
    await db.clientes.put(cliente);
  },

  async update(id: string, dados: Partial<Cliente>): Promise<void> {
    await db.clientes.update(id, dados);
  },

  async remove(id: string): Promise<void> {
    await db.clientes.delete(id);
  },

  async setAll(clientes: Cliente[]): Promise<void> {
    await db.clientes.clear();
    await db.clientes.bulkAdd(clientes);
  }
};

// Funções para gerenciar operações anteriores
export const operacoesManager = {
  async getAll(): Promise<ResumoOperacao[]> {
    return await db.operacoes.orderBy('dataOperacao').reverse().toArray();
  },

  async add(operacao: ResumoOperacao): Promise<void> {
    await db.operacoes.put(operacao);
  },

  async remove(id: string): Promise<void> {
    await db.operacoes.delete(id);
  },

  async clear(): Promise<void> {
    await db.operacoes.clear();
  },

  async clearAll(): Promise<void> {
    await db.operacoes.clear();
  }
};

// Função para limpar todos os dados do sistema
export const limparTodosSistema = async (): Promise<void> => {
  try {
    await db.estadoDia.clear();
    await db.espetinhos.clear();
    await db.clientes.clear();
    await db.operacoes.clear();
    await db.configuracoes.clear();
    
    // Recriar configurações padrão
    const configPadrao: StoredConfiguracoes = {
      permitirIniciarSemSaldo: false,
      controlarEstoque: true,
      nomeEmpresa: '',
      chavePix: '',
      dataAtualizacao: new Date().toISOString()
    };
    await db.configuracoes.add(configPadrao);
  } catch (error) {
    console.error('Erro ao limpar todos os dados:', error);
    throw error;
  }
};

// Funções para gerenciar configurações
export const configuracoesManager = {
  async get(): Promise<Configuracoes> {
    const configs = await db.configuracoes.toArray();
    if (configs.length > 0) {
      return configs[0];
    }
    
    // Configurações padrão
    const configPadrao: Configuracoes = {
      permitirIniciarSemSaldo: false,
      controlarEstoque: true,
      nomeEmpresa: '',
      chavePix: '',
      dataAtualizacao: new Date().toISOString()
    };
    
    await db.configuracoes.add(configPadrao);
    return configPadrao;
  },

  async set(configuracoes: Configuracoes): Promise<void> {
    await db.configuracoes.clear();
    await db.configuracoes.add({
      ...configuracoes,
      dataAtualizacao: new Date().toISOString()
    });
  }
};