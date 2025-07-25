import { createContext, useState, ReactNode } from 'react';
import { TelasApp } from '../types/TelasApp';

interface NavigationContextType {
  telaAtual: TelasApp;
  navigate: (tela: TelasApp) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [telaAtual, setTelaAtual] = useState<TelasApp>('home');
  const navigate = (tela: TelasApp) => setTelaAtual(tela);

  return (
    <NavigationContext.Provider value={{ telaAtual, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}
