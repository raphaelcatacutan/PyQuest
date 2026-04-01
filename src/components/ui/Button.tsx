import { ReactNode } from "react";


interface ButtonProps {
  variant?: 'primary' | 'login-btn' | 'run-btn' | 'bag-btn' | 'icon-only-btn';
  text?: string;
  icon?: ReactNode;
  iconSize?: number;
  onClick?: () => void;
  alt_text?: string;
  title?: string;
}

export default function Button({variant, text, icon, iconSize, onClick, alt_text, title}: ButtonProps){
  const getStyle = () => {
    switch (variant) {
      case 'primary':
        return "w-fit rounded-lg border border-transparent px-5 py-2.4 font-medium bg-neutral-900 cursor-pointer transition-colors duration-250 hover:border-blue-500 focus:outline-4 focus-visible:outline-blue-500";
      case 'login-btn':
        return "w-full rounded-lg border border-transparent px-5 py-3 font-semibold bg-neutral-900 cursor-pointer transition-colors duration-250 hover:border-blue-500 focus:outline-4 focus-visible:outline-blue-500";
      case 'run-btn':
        return "w-fit p-2 rounded-lg cursor-pointer transition-colors duration-250 hover:bg-amber-500 hover:bg-opacity-30"
      case 'bag-btn':
        return "w-fit cursor-pointer border bg-[#23100a] px-1"
      case 'icon-only-btn':
        return "w-fit cursor-pointer p-0.5 rounded-lg transition-colors duration-250 hover:bg-gray-600 hover:bg-opacity-30 active:bg-gray-800"
      default:
        return "w-fit border border-gray-300 cursor-pointer";
    }
  };
  
  return  (
    <button className={getStyle()} onClick={onClick} title={title}>
      {icon && typeof icon === 'string' ? (
        <img src={icon} style={{ width: iconSize, height: iconSize }} alt={alt_text} />
      ) : (
        <span style={{ width: iconSize, height: iconSize }}>
          {icon}
        </span>
      )}
      {text}
    </button>
  )
}