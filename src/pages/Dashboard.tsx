import Sidebar from "src/components/app/Sidebar";
import Appbar from "src/components/app/Appbar";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setBoards, setColumns, setTasks } from "src/redux/features/dashboardSlice";
import useFirestoreListener from 'src/hooks/useFirestoreListener';
import { collection, query, where } from "firebase/firestore";
import { db } from "src/lib/firebase";
import { Board, Column as ColumnType, Task } from "src/utilities/types";
import useSelectedBoard from "src/hooks/useSelectedBoard";
import Column from 'src/components/app/Column';
import { FaPlus } from 'react-icons/fa';
import AddColumnModal from 'src/components/modals/AddColumnModal';
import { openModal } from "src/redux/features/modalsSlice";

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
      <div className="flex-1 h-full flex flex-col" style={{ width: "calc(100vw - 20%)" }}>
        <Appbar />
        <div className="flex-1 p-5 flex gap-10 h-full overflow-x-auto">
          {columns.map((column) => (           
            <Column column={column} key={column.id} />
          ))}
          {selectedBoardId && (
            <div 
              className="bg-gray-800 w-full lg:w-64 h-full rounded-md flex items-center justify-center gap-2 text-gray-400 cursor-pointer transition-colors hover:bg-gray-700 shrink-0"
              onClick={() => dispatch(openModal(<AddColumnModal />))}  
            >
              <FaPlus />
              <h1 className="font-medium text-xl">Add column</h1>
            </div>
          )}
        </div>  
      </div>
    </div>
  );
}