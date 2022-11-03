import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import routes from 'src/utilities/routes';
import { FaTrash, FaHome } from 'react-icons/fa'; 
import { auth, db } from 'src/lib/firebase';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import useAsync from 'src/hooks/useAsync';

export default function ProfileFormButtons() {
  const navigate = useNavigate();

  const { loading, success, trigger } = useAsync(async () => {
    if (auth.currentUser === null) return;
    // Delete board docs
    const boardsQ = query(collection(db, "boards"), where("userId", "==", auth.currentUser.uid));
    const boardsQuerySnapshot = await getDocs(boardsQ);
    boardsQuerySnapshot.forEach(async (doc) => deleteDoc(doc.ref));
    // Delete columns docs
    const columnsQ = query(collection(db, "columns"), where("userId", "==", auth.currentUser.uid));
    const columnsQuerySnapshot = await getDocs(columnsQ);
    columnsQuerySnapshot.forEach(async (doc) => deleteDoc(doc.ref));
    // Delete tasks docs
    const tasksQ = query(collection(db, "tasks"), where("userId", "==", auth.currentUser.uid));
    const tasksQuerySnapshot = await getDocs(tasksQ);
    tasksQuerySnapshot.forEach(async (doc) => deleteDoc(doc.ref));
    // Delete user profile
    await deleteUser(auth.currentUser);
  });

  useEffect(() => {
    // Redirect to sign in page after deleting profile
    if (success) {
      navigate(routes.signIn);  
    }
  }, [success]);

  return (
    <div className="flex flex-col gap-3">
      <Link to={routes.index}>
        <button  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-2 rounded-md font-medium flex items-center justify-center gap-2">
          <FaHome />
          Back to dashboard
        </button>
      </Link>
      <button
        className={`w-full bg-red-600 hover:bg-red-700 transition-colors px-5 py-2 rounded-md font-medium flex items-center justify-center gap-2 ${loading ? "btn-loading" : " "}`}
        onClick={trigger}
      >
        <FaTrash />
        Delete profile
      </button>
    </div>
  )
}