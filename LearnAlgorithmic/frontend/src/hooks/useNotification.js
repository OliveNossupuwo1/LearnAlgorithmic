import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showNotification = useCallback((type, title, message, autoClose = true, duration = 3000) => {
    setNotification({ type, title, message, autoClose, duration });
  }, []);

  const showSuccess = useCallback((title, message) => {
    showNotification('success', title, message);
  }, [showNotification]);

  const showError = useCallback((title, message) => {
    showNotification('error', title, message);
  }, [showNotification]);

  const showWarning = useCallback((title, message) => {
    showNotification('warning', title, message);
  }, [showNotification]);

  const showInfo = useCallback((title, message) => {
    showNotification('info', title, message);
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const confirm = useCallback((title, message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        title,
        message,
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  return {
    notification,
    confirmDialog,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    confirm
  };
};
