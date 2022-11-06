import { SelectHTMLAttributes, ReactNode } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export default function SelectInput({ children, ...selectProps }: Props) {
  return (
    <select className="bg-gray-700 outline-none cursor-pointer p-2" {...selectProps}>
      {children}
    </select>
  )
}