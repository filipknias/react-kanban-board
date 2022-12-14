import Modal from "src/components/modals/Modal"
import { useEffect, useState } from 'react';
import useAsync from 'src/hooks/useAsync';
import { addDoc, collection } from 'firebase/firestore';
import { db, timestamp } from 'src/lib/firebase';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { hideModal } from 'src/redux/features/modalsSlice';
import TextInput from 'src/components/common/TextInput';
import FormMessage from 'src/components/forms/FormMessage';
import Button from "src/components/common/Button";

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
            <FormMessage variant="error">{formatFirebaseError(error)}</FormMessage>
          )}
          <TextInput
            type="text"
            placeholder="Column name"
            required
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </form>
    </Modal>
  )
}