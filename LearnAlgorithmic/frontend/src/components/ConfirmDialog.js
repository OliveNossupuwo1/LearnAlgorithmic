const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'danger':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 ${getBorderColor()} animate-slide-in`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>

          {message && (
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md ${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
