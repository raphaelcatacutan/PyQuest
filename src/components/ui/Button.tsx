import { ReactNode } from "react";


interface ButtonProps {
  variant?: 'primary' | 'run-btn' | 'bag-btn' | 'icon-only-btn';
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
      case 'run-btn':
        return "w-fit bg-amber-500 "
      case 'bag-btn':
        return "w-fit cursor-pointer border-1 hover:"
      case 'icon-only-btn':
        return "w-fit cursor-pointer"
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