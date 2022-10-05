import Sidebar from "../components/app/Sidebar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setBoards, setColumns, setTasks } from "../redux/features/dashboardSlice";
import useFirestoreListener from '../hooks/useFirestoreListener';
import { collection, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Board, Column, Task } from "../utilities/types";

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  // Queries
  const boardsQuery = query(collection(db, "boards"), where("userId", "==", user?.uid));
  const columnsQuery = query(collection(db, "columns"), where("userId", "==", user?.uid));
  const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user?.uid));

  // Firestore listeners
  useFirestoreListener<Board>(boardsQuery, (boards) => dispatch(setBoards(boards)));
  useFirestoreListener<Column>(columnsQuery, (columns) => dispatch(setColumns(columns)));
  useFirestoreListener<Task>(tasksQuery, (tasks) => dispatch(setTasks(tasks)));

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1">
        {/* CONTENT */}
      </div>
    </div>
  );
}