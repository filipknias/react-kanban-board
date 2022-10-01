import { FaThList } from 'react-icons/fa';

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
        className="flex items-center gap-3 px-5 py-2 rounded-tr-xl rounded-br-xl font-medium text-lg w-11/12 text-gray-400 transition-colors hover:bg-purple-600 cursor-pointer hover:text-white"
        key={board.id}  
      >
          <FaThList />
          {board.name}
        </li>
      ))}
    </ul>
  )
};