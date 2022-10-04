import Sidebar from "../components/app/Sidebar";


export default function Dashboard() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1">
        {/* CONTENT */}
      </div>
    </div>
  );
}