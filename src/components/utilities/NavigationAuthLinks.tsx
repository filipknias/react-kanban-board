import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import routes from '../../utilities/routes';

export default function NavigationAuthLinks() {
  return (
    <div className="w-full px-5 flex flex-col gap-3">
      <Link to={routes.profile}>
        <button className="sidebar-btn">
          <FaUserAlt />
          My profile
        </button>
      </Link>
      <button className="sidebar-btn" onClick={() => signOut(auth)}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  )
}