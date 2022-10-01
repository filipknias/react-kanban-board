import Logo from '../../components/utilities/Logo';
import BoardsList from './BoardsList';

const mockBoards = [
  { id: '1', name: 'Platform Launch' },
  { id: '2', name: 'Marketing Plan' },
  { id: '3', name: 'Roadmap' },
];

export default function Sidebar() {
  return (
    <div className="bg-gray-800 border-r-2 border-r-gray-700 h-full w-1/5 flex flex-col">
      <div className="p-8 flex justify-center border-b-2 border-b-gray-700">
        <Logo />
      </div>
      <div className="py-8 flex flex-col justify-between flex-1">
        <BoardsList boards={mockBoards} />
      </div>
    </div>
  )
};