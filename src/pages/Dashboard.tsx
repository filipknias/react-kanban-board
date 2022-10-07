import Sidebar from "../components/app/Sidebar";
import Appbar from "../components/app/Appbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setBoards, setColumns, setTasks } from "../redux/features/dashboardSlice";
import useFirestoreListener from '../hooks/useFirestoreListener';
import { collection, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Board, Column as ColumnType, Task } from "../utilities/types";
import useSelectedBoard from "../hooks/useSelectedBoard";
import Column from '../components/app/Column';
import { FaPlus } from 'react-icons/fa';
import AddColumnModal from '../components/modals/AddColumnModal';
import { openModal } from "../redux/features/modalsSlice";

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const selectedBoardId = useAppSelector((state) => state.dashboard.selectedBoardId);
  const dispatch = useAppDispatch();

  // Queries
  const boardsQuery = query(collection(db, "boards"), where("userId", "==", user?.uid));
  const columnsQuery = query(collection(db, "columns"), where("userId", "==", user?.uid));
  const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user?.uid));

  // Firestore listeners
  useFirestoreListener<Board>(boardsQuery, (boards) => dispatch(setBoards(boards)));
  useFirestoreListener<ColumnType>(columnsQuery, (columns) => dispatch(setColumns(columns)));
  useFirestoreListener<Task>(tasksQuery, (tasks) => dispatch(setTasks(tasks)));

  const { columns } = useSelectedBoard();

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1">
        <div className="flex flex-col h-full">
          <Appbar />
          <div className="flex-1 p-5">
            <div className="flex gap-10 h-full">
              {columns.map((column) => (
                <Column column={column} key={column.id} />
              ))}
              {selectedBoardId && (
                <div 
                  className="bg-gray-800 w-64 rounded-md flex items-center justify-center gap-2 text-gray-400 cursor-pointer transition-colors hover:bg-gray-700"
                  onClick={() => dispatch(openModal(<AddColumnModal />))}  
                >
                  <FaPlus />
                  <h1 className="font-medium text-xl">Add column</h1>
                </div>
              )}
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
}