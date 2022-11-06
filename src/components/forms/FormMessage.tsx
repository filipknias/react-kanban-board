interface Props {
  variant: "success" | "error";
  children: React.ReactNode;
}

export default function FormMessage({ variant, children }: Props) {
  return (
    <div className={`${variant === "success" ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"} text-red-50 rounded-sm w-full border-2 py-2 px-4 text-center`}>
      {children}
    </div>
  )
}