import { ReactNode } from 'react';
import { TelasApp } from '../types/TelasApp';
import { useNavigation } from '../hooks/useNavigation';

interface RouteProps {
  tela: TelasApp;
  children: ReactNode;
}

export function Route({ tela, children }: RouteProps) {
  const { telaAtual } = useNavigation();
  return telaAtual === tela ? <>{children}</> : null;
};
