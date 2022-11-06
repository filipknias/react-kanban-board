import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "info";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  variant?: Variant;
  children: ReactNode;
}

const getVariantClasses = (variant: Variant) => {
  switch (variant) {
    case "primary": return "bg-purple-600 hover:bg-purple-700 text-white";
    case "secondary": return "bg-white text-purple-700 hover:bg-opacity-80";
    case "danger": return "bg-red-500 hover:bg-red-600 text-white";
    case "info": return "bg-blue-600 hover:bg-blue-700 text-white";
  }
}

export default function Button({
  disabled = false, 
  variant = "primary", 
  children, 
  ...buttonProps 
}: Props) {
  return (
    <button
      {...buttonProps}
      className={`${getVariantClasses(variant)} ${disabled ? "cursor-default opacity-50 pointer-events-none" : ""} transition-colors px-4 py-2 flex items-center justify-center gap-2 rounded-sm w-full font-medium whitespace-nowrap`}
    >
      {children}
    </button>
  )
}