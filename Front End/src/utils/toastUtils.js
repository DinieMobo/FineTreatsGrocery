import toast from 'react-hot-toast';

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showLoading = (message) => toast.loading(message);

export const showWarning = (message) => {
  return toast(message, {
    icon: '⚠️',
    style: {
      borderRadius: '10px',
      background: '#fff8e1',
      color: '#ffa000',
      border: '1px solid #ffd54f'
    },
  });
};

export const showInfo = (message) => {
  return toast(message, {
    icon: 'ℹ️',
    style: {
      borderRadius: '10px',
      background: '#e3f2fd',
      color: '#1976d2',
      border: '1px solid #90caf9'
    },
  });
};

export const dismissAll = () => toast.dismiss();

export default {
  success: showSuccess,
  error: showError,
  loading: showLoading,
  warning: showWarning,
  info: showInfo,
  dismiss: toast.dismiss,
  dismissAll
};