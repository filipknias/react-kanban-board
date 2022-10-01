import { FaThList, FaPlus } from 'react-icons/fa';

interface Board {
  id: string;
  name: string;
}

interface Props {
  boards: Board[];
}

export default function BoardsList({ boards }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {boards.map((board) => (
        <li 
        className="boards-list-item"
        key={board.id}  
      >
          <FaThList />
          {board.name}
        </li>
      ))}
      <li className="boards-list-item">
        <FaPlus />
        Create new board
      </li>
    </ul>
  )
};