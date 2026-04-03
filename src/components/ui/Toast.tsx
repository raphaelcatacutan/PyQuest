import { toast } from 'react-toastify';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProp {
  variant?: ToastVariant;
  message: string;
}

const variantConfig = {
  success: {
    icon: '✓',
    bgColor: '#1f2937',
    borderColor: '#22c55e',
    textStyle: 'text text-blue-100',
  },
  error: {
    icon: '⚠', 
    bgColor: '#7f1d1d',
    borderColor: '#ef4444',
    textStyle: 'text text-blue-100',
  },
  warning: {
    icon: '!',
    bgColor: '#78350f',
    borderColor: '#eab308',
    textStyle: 'text text-blue-100',
  },
  info: {
    icon: 'ℹ',
    bgColor: '#131315',
    borderColor: '#3b82f6',
    textStyle: 'text-20 text-blue-100',
  },
};

function RPGToast({ message, variant }: { message: string; variant: ToastVariant }) {
  const config = variantConfig[variant]

  return (
    <div className={`w-full text-center text-sm ${config.textStyle}`}>
      {message}
    </div>
  );
}

export default function showToast({ variant = 'info', message }: ToastProp) {
  const config = variantConfig[variant]

  toast(<RPGToast message={message} variant={variant} />, {
    position: 'top-center',
    style: {
      backgroundColor: config.bgColor,
      border: `2px solid ${config.borderColor}`,
      borderRadius: '8px',
    },
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}