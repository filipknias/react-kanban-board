import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function NavigationAuthLinks() {
  return (
    <div className="w-full px-5 flex flex-col gap-3">
      <button className="sidebar-btn">
        <FaUserAlt />
        My profile
      </button>
      <button className="sidebar-btn" onClick={() => signOut(auth)}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  )
}