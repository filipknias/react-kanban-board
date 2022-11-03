import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>

export default function TextInput({ ...inputProps }: Props) {
  return (
    <input 
      className="bg-gray-700 border-none outline-none p-2 rounded-sm w-full"
      {...inputProps}
    />
  )
}