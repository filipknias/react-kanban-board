import { FaThList, FaPlus } from 'react-icons/fa';
import { useAppDispatch } from '../../redux/hooks';
import CreateBoardModal from '../modals/CreateBoardModal';
import { openModal } from '../../redux/features/modalsSlice';
import { Board } from '../../utilities/types';

interface Props {
  boards: Board[];
}

export default function BoardsList({ boards }: Props) {
  const dispatch = useAppDispatch();

  return (
    <ul className="flex flex-col gap-2">
      {boards.map((board) => (
        <li className="boards-list-item" key={board.id}>
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