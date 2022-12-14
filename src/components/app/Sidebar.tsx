import Logo from 'src/components/common/Logo';
import BoardsList from 'src/components/app/BoardsList';
import { useAppSelector } from 'src/redux/hooks';
import NavigationAuthLinks from 'src/components/common/NavigationAuthLinks';

export default function Sidebar() {
  const { boards } = useAppSelector((state) => state.dashboard);

  return (
    <div className="hidden lg:flex flex-col bg-gray-800 border-r-2 border-r-gray-700 h-full w-1/5">
      <div className="p-8 flex justify-center border-b-2 border-b-gray-700 h-24">
        <Logo />
      </div>
      <div className="py-8 flex flex-col justify-between flex-1">
        <BoardsList boards={boards} />
        <NavigationAuthLinks />
      </div>
    </div>
  )
};