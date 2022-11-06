import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from 'src/lib/firebase';
import { Link } from 'react-router-dom';
import routes from 'src/utilities/routes';
import Button from "src/components/common/Button";

export default function NavigationAuthLinks() {
  return (
    <div className="w-full px-5 flex flex-col gap-3">
      <Link to={routes.profile}>
        <Button>
          <FaUserAlt />
          My profile
        </Button>
      </Link>
      <Button onClick={() => signOut(auth)}>
        <FaSignOutAlt />
        Logout
      </Button>
    </div>
  )
}