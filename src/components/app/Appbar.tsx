import useSelectedBoard from "../../hooks/useSelectedBoard";
import { FaPlus, FaCog } from 'react-icons/fa';
import AddTaskModal from '../modals/AddTaskModal';
import { useAppDispatch } from "../../redux/hooks";
import { openModal } from "../../redux/features/modalsSlice";

export default function Appbar() {
  const { board } = useSelectedBoard();
  const dispatch = useAppDispatch();

  return (
    <div className="bg-gray-800 border-b-2 border-b-gray-700 py-8 px-5 h-24 flex items-center justify-between">
      {board && (
        <>
          <h1 className="font-medium text-2xl">{board.name}</h1>
          <div className="flex gap-5">
            <button 
              className="bg-purple-600 rounded-sm p-3 text-white flex items-center gap-2 transition-colors hover:bg-purple-700 font-medium"
              onClick={() => dispatch(openModal(<AddTaskModal />))}
            >
              <FaPlus />
              <span className="hidden lg:block">Add Task</span>
            </button>
            <button className="bg-purple-600 rounded-sm p-3 text-white flex items-center gap-2 transition-colors hover:bg-purple-700 font-medium">
              <FaCog />
              <span className="hidden lg:block">Options</span>
            </button>
          </div>
        </>    
      )}
    </div>
  )
};