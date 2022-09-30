import { useAppSelector } from "../redux/hooks";

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <p>{user.uid}</p>: <p>No user</p>;
}