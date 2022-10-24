import React, { useState, useEffect } from 'react';
import useAsync from '../../hooks/useAsync';
import { auth, db } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { updatePassword, deleteUser } from 'firebase/auth';
import { deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAppDispatch } from '../../redux/hooks';
import { FaTrash, FaHome } from 'react-icons/fa'; 
import { useNavigate, Link } from 'react-router-dom';
import routes from '../../utilities/routes';
import { openModal } from '../../redux/features/modalsSlice';
import ReauthenticateModal from '../modals/ReauthenticateModal';
import UpdateEmailForm from './UpdateEmailForm';

export default function UpdateProfileForm() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string|null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const updatePasswordAction = useAsync(async () => {
    setPasswordError(null);
    if (auth.currentUser === null) return;
    await updatePassword(auth.currentUser, newPassword);
  });

  const deleteProfileAction = useAsync(async () => {
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Confirm password validation
    if (newPassword !== confirmPassword) return setPasswordError("Passwords must be the same");
    updatePasswordAction.trigger();
  };

  useEffect(() => {
    // Set password error message
    if (updatePasswordAction.error !== null) setPasswordError(formatFirebaseError(updatePasswordAction.error));
  }, [updatePasswordAction.error]);

  useEffect(() => {
    // Redirect to sign in page after deleting profile
    if (deleteProfileAction.success) navigate(routes.signIn);
  }, [deleteProfileAction.success]);

  useEffect(() => {
    // Reauthenticate user
    dispatch(openModal(<ReauthenticateModal />));
  }, []);

  return (
    <div className="auth-form-container">
      <div className="flex flex-col gap-12">
        <UpdateEmailForm />
        <form className="flex flex-col gap-3" onSubmit={handlePasswordSubmit}>
          <label htmlFor="password" className="font-medium">Update Password</label>
          {passwordError && (
            <div className="auth-form-error-message">{passwordError}</div>
          )}
          {updatePasswordAction.success && (
            <div className="auth-form-success-message">Your password has changed</div>
          )}
          <input
            id="password"
            type="password"
            className="text-input"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="text-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full bg-purple-700 hover:bg-purple-800 transition-colors px-5 py-2 rounded-md font-medium ${updatePasswordAction.loading ? "btn-loading" : " "}`}
          >
            Update password
          </button>
        </form>
        <div className="flex flex-col gap-3">
          <Link to={routes.index}>
            <button  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-2 rounded-md font-medium flex items-center justify-center gap-2">
              <FaHome />
              Back to dashboard
            </button>
          </Link>
          <button
            className={`w-full bg-red-600 hover:bg-red-700 transition-colors px-5 py-2 rounded-md font-medium flex items-center justify-center gap-2 ${deleteProfileAction.loading ? "btn-loading" : " "}`}
            onClick={() => deleteProfileAction.trigger()}
          >
            <FaTrash />
            Delete profile
          </button>
        </div>
      </div>
    </div>
  )
}