import { useAppSelector, useAppDispatch } from "../redux/hooks";
import Sidebar from "../components/app/Sidebar";
import { useEffect } from 'react';
import { fetchBoards } from '../redux/features/dashboardSlice';


export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user === null) return;
    dispatch(fetchBoards(user.uid));
  }, []);

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1">
        {/* CONTENT */}
      </div>
    </div>
  );
}