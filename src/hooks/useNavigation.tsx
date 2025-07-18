import { useContext } from "react";
import { NavigationContext } from '../context/NavigationContext'

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation precisa estar dentro do NavigationProvider');
  return ctx;
};
