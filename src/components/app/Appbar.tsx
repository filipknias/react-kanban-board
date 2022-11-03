import useSelectedBoard from "src/hooks/useSelectedBoard";
import { FaPlus, FaCog, FaBars } from 'react-icons/fa';
import AddTaskModal from 'src/components/modals/AddTaskModal';
import { useAppDispatch } from "src/redux/hooks";
import { openModal } from "src/redux/features/modalsSlice";
import EditBoardModal from 'src/components/modals/EditBoardModal';
import MobileMenu from "src/components/app/MobileMenu";
import { useState } from 'react';

export default function Appbar() {
  const { board } = useSelectedBoard();
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gray-800 border-b-2 border-b-gray-700 py-8 px-5 h-24 flex items-center justify-between w-screen lg:w-auto">
      <MobileMenu open={menuOpen} hideMenu={() => setMenuOpen(false)} />
      <div className="flex items-center gap-3">
        <div 
          className="bg-purple-500 rounded-sm flex items-center justify-center p-3 cursor-pointer transition-colors hover:bg-purple-600 lg:hidden"
          onClick={() => setMenuOpen((prevOpen) => !prevOpen)}  
        >
          <FaBars />
        </div>
        {board && ( <h1 className="font-medium text-xl lg:text-2xl">{board.name}</h1>)}
      </div>
      {board && (
        <div className="flex gap-5">
          <button 
            className="bg-purple-600 rounded-sm p-3 text-white flex items-center gap-2 transition-colors hover:bg-purple-700 font-medium"
            onClick={() => dispatch(openModal(<AddTaskModal />))}
          >
            <FaPlus />
            <span className="hidden lg:block">Add Task</span>
          </button>
          <button 
            className="bg-purple-600 rounded-sm p-3 text-white flex items-center gap-2 transition-colors hover:bg-purple-700 font-medium"
            onClick={() => dispatch(openModal(<EditBoardModal board={board} />))}  
          >
            <FaCog />
            <span className="hidden lg:block">Options</span>
          </button>
        </div>  
      )}
    </div>
  )
};