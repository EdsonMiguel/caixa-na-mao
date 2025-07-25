import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  function getTypeStyles() {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'bg-red-500 hover:bg-red-600',
          border: 'border-red-200',
          bg: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          button: 'bg-yellow-500 hover:bg-yellow-600',
          border: 'border-yellow-200',
          bg: 'bg-yellow-50'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
          border: 'border-blue-200',
          bg: 'bg-blue-50'
        };
      default:
        return {
          icon: 'text-yellow-600',
          button: 'bg-yellow-500 hover:bg-yellow-600',
          border: 'border-yellow-200',
          bg: 'bg-yellow-50'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 mb-6`}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className={styles.icon} />
              <div className="flex-1">
                <p className="text-gray-800 whitespace-pre-line">{message}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 px-4 ${styles.button} text-white rounded-lg font-semibold transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}