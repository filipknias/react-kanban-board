import { FaThList, FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import CreateBoardModal from 'src/components/modals/CreateBoardModal';
import { openModal } from 'src/redux/features/modalsSlice';
import { Board } from 'src/utilities/types';
import { setSelectedBoardId } from 'src/redux/features/dashboardSlice';

interface Props {
  boards: Board[];
}

export default function BoardsList({ boards }: Props) {
  const selectedBoardId = useAppSelector((state) => state.dashboard.selectedBoardId);
  const dispatch = useAppDispatch();

  return (
    <ul className="flex flex-col gap-2">
      {boards.map((board) => (
        <li 
          className={`flex items-center gap-3 px-5 py-2 rounded-tr-xl rounded-br-xl font-medium text-lg w-11/12 text-gray-400 transition-colors hover:bg-purple-600 cursor-pointer hover:text-white ${selectedBoardId === board.id ? 'bg-purple-600 text-white' : ''}`} 
          key={board.id}
          onClick={() => dispatch(setSelectedBoardId(board.id))}
        >
          <FaThList />
          {board.name}
        </li>
      ))}
      <li 
        className="flex items-center gap-3 px-5 py-2 rounded-tr-xl rounded-br-xl font-medium text-lg w-11/12 text-gray-400 transition-colors hover:bg-purple-600 cursor-pointer hover:text-white" 
        onClick={() => dispatch(openModal(<CreateBoardModal />))}
      >
        <FaPlus />
        Create new board
      </li>
    </ul>
  )
};