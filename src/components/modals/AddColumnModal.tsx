import Modal from "./Modal"
import { useEffect, useState } from 'react';
import useAsync from '../../hooks/useAsync';
import { addDoc, collection } from 'firebase/firestore';
import { db, timestamp } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';
import TextInput from 'src/components/utilities/TextInput';

export default function AddColumnModal() {
  const [columnName, setColumnName] = useState('');
  const user = useAppSelector((state) => state.auth.user);
  const selectedBoardId = useAppSelector((state) => state.dashboard.selectedBoardId);
  const dispatch = useAppDispatch();

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null || selectedBoardId === null) return;

    await addDoc(collection(db, "columns"), {
      name: columnName, 
      userId: user.uid, 
      boardId: selectedBoardId,
      createdAt: timestamp 
    });
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
  };

  useEffect(() => {
    // Hide modal on success
    if (success) dispatch(hideModal());
  }, [success]);

  return (
    <Modal>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <h1 className="text-lg font-medium">Add Column</h1>
        <div className="flex flex-col gap-3">
          {error && (
            <div className="auth-form-error-message">{formatFirebaseError(error)}</div>
          )}
          <TextInput
            type="text"
            placeholder="Column name"
            required
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </div>
        <button type="submit" className={`modal-form-btn ${loading ? "btn-loading" : ""}`}>
          Save
        </button>
      </form>
    </Modal>
  )
}