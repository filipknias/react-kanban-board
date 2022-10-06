import Logo from '../../components/utilities/Logo';
import BoardsList from './BoardsList';
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAppSelector } from '../../redux/hooks';

export default function Sidebar() {
  const { boards } = useAppSelector((state) => state.dashboard);

  return (
    <div className="hidden lg:flex flex-col bg-gray-800 border-r-2 border-r-gray-700 h-full w-1/5">
      <div className="p-8 flex justify-center border-b-2 border-b-gray-700 h-24">
        <Logo />
      </div>
      <div className="py-8 flex flex-col justify-between flex-1">
        <BoardsList boards={boards} />
        <div className="px-8 flex flex-col gap-3">
          <button className="sidebar-btn">
            <FaUserAlt />
            My profile
          </button>
          <button className="sidebar-btn" onClick={() => signOut(auth)}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
};