import React from "react";

export default function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-sm shadow-md px-5 py-10 border-t-4 border-t-purple-700 w-full md:w-1/2 xl:w-1/4">
      {children}
    </div>
  )
}