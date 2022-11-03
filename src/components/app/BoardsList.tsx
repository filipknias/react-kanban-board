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
          className={`boards-list-item ${selectedBoardId === board.id ? 'boards-list-item-active' : ''}`} 
          key={board.id}
          onClick={() => dispatch(setSelectedBoardId(board.id))}
        >
          <FaThList />
          {board.name}
        </li>
      ))}
      <li className="boards-list-item" onClick={() => dispatch(openModal(<CreateBoardModal />))}>
        <FaPlus />
        Create new board
      </li>
    </ul>
  )
};