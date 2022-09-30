export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-stretch gap-1">
        <div className="bg-purple-700 rounded-md py-4 px-1"></div>
        <div className="bg-purple-600 rounded-md py-4 px-1"></div>
        <div className="bg-purple-500 rounded-md py-4 px-1"></div>
      </div>
      <h1 className="font-bold text-3xl">kanban</h1>
    </div>
  )
}