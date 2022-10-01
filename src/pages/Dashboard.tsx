import { useAppSelector } from "../redux/hooks";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <>
      {user ? <p>{user.uid}</p>: <p>No user</p>}
      <button onClick={() => signOut(auth)}>Logout</button>
    </>
  );
}