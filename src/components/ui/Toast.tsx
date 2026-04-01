import { toast } from 'react-toastify';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProp {
  variant?: ToastVariant;
  message: string;
}

const variantConfig = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-900/80',
    borderColor: 'border-green-500',
    textStyle: 'text text-blue-100',
  },
  error: {
    icon: '⚠', 
    bgColor: 'bg-red-900/80',
    borderColor: 'border-red-500',
    textStyle: 'text text-blue-100',
  },
  warning: {
    icon: '!',
    bgColor: 'bg-yellow-900/80',
    borderColor: 'border-yellow-500',
    textStyle: 'text text-blue-100',
  },
  info: {
    icon: 'ℹ',
    bgColor: 'bg-header',
    borderColor: 'border-blue-500',
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
    className: `!${config.bgColor} border`,
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}