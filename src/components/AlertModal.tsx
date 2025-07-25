import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttonText?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK'
}: AlertModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          button: 'bg-green-500 hover:bg-green-600',
          border: 'border-green-200',
          bg: 'bg-green-50'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          button: 'bg-red-500 hover:bg-red-600',
          border: 'border-red-200',
          bg: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          button: 'bg-yellow-500 hover:bg-yellow-600',
          border: 'border-yellow-200',
          bg: 'bg-yellow-50'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
          border: 'border-blue-200',
          bg: 'bg-blue-50'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
          border: 'border-blue-200',
          bg: 'bg-blue-50'
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

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
              <IconComponent size={24} className={styles.iconColor} />
              <div className="flex-1">
                <p className="text-gray-800 whitespace-pre-line">{message}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 ${styles.button} text-white rounded-lg font-semibold transition-colors`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}