import { useAppSelector } from "../redux/hooks";
import Sidebar from "../components/app/Sidebar";

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1">
        {/* CONTENT */}
      </div>
    </div>
  );
}