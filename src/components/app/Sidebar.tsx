import { useState, useEffect } from 'react';
import Logo from '../../components/utilities/Logo';
import BoardsList from './BoardsList';
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useAppSelector } from '../../redux/hooks';
import { Board } from '../../utilities/types';
import { collection, query, where, onSnapshot, CollectionReference } from "firebase/firestore";

export default function Sidebar() {
  const [boards, setBoards] = useState<Board[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user === null) return; 

    const q = query(collection(db, "boards") as CollectionReference<Board>, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const boards: Board[] = [];
      querySnapshot.forEach((doc) => {
        boards.push({ ...doc.data(), id: doc.id });
      });
      setBoards(boards);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-gray-800 border-r-2 border-r-gray-700 h-full w-1/5 flex flex-col">
      <div className="p-8 flex justify-center border-b-2 border-b-gray-700">
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