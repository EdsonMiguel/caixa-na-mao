/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';
import {AlertModal} from '../components/AlertModal';

type AlertType = 'success' | 'error' | 'warning' | 'info';

type ShowAlertParams = {
  title: string,
  message: string,
  type?: AlertType
}

interface AlertModalContextType {
  showAlert: (e: ShowAlertParams) => void;
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

export const 
useAlert = (): AlertModalContextType => {
  const ctx = useContext(AlertModalContext);
  if (!ctx) throw new Error('useAlert deve ser usado dentro de AlertModalProvider');
  return ctx;
};

export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertType>('info');

  function showAlert({title, message, type = 'info'   } : ShowAlertParams) {
    setTitle(title);
    setMessage(message);
    setType(type);
    setIsOpen(true);
  };

  function handleClose() {
    setIsOpen(false);
  };

  return (
    <AlertModalContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        title={title}
        message={message}
        type={type}
        onClose={handleClose}
      />
    </AlertModalContext.Provider>
  );
};
