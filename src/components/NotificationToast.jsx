import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationToast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  return (
    <div className={`toast-notification ${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        <X size={16} />
      </button>

      <style>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 300px;
          max-width: 500px;
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
          border-left: 4px solid var(--primary);
        }

        .toast-notification.hide {
          animation: slideOut 0.3s ease-out;
        }

        .toast-notification.success {
          border-left-color: var(--success);
        }

        .toast-notification.error {
          border-left-color: var(--danger);
        }

        .toast-notification.warning {
          border-left-color: var(--warning);
        }

        .toast-notification.info {
          border-left-color: var(--info);
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-notification.success .toast-icon {
          color: var(--success);
        }

        .toast-notification.error .toast-icon {
          color: var(--danger);
        }

        .toast-notification.warning .toast-icon {
          color: var(--warning);
        }

        .toast-notification.info .toast-icon {
          color: var(--info);
        }

        .toast-message {
          flex: 1;
          color: var(--gray-900);
          font-size: 14px;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-500);
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: var(--gray-100);
          color: var(--gray-900);
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .toast-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
          }

          @keyframes slideIn {
            from {
              transform: translateY(-100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(-100px);
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default NotificationToast;
