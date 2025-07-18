/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmModal from '../components/ConfirmModal';

type ModalType = 'danger' | 'warning' | 'info';

type ShowConfirmParams ={
  title: string,
  message: string,
  onConfirm: () => void,
  type: ModalType
}

interface ConfirmModalContextType {
  showConfirm: (p: ShowConfirmParams) => void
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

export const useConfirm = () => {
  const ctx = useContext(ConfirmModalContext);
  if (!ctx) throw new Error('useConfirm deve estar dentro do ConfirmModalProvider');
  return ctx;
};

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ModalType>('warning');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  function showConfirm ({ type = 'warning', ...params } : ShowConfirmParams ) {
    setTitle(params.title);
    setMessage(params.message);
    setType(type);
    setOnConfirm(() => params.onConfirm);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <ConfirmModalContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        title={title}
        message={message}
        type={type}
        onConfirm={handleConfirm}
        onClose={handleClose}

      />
    </ConfirmModalContext.Provider>
  );
};
