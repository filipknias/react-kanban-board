import Modal from "./Modal"
import { useEffect, useState } from 'react';
import { BsXLg } from 'react-icons/bs';
import useAsync from '../../hooks/useAsync';
import { addDoc, collection } from 'firebase/firestore';
import { db, timestamp } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';
import { setSelectedBoardId } from '../../redux/features/dashboardSlice';

interface Column {
  idx: number;
  name: string;
}

export default function CreateBoardModal() {
  const [name, setName] = useState<string>('');
  const [columns, setColumns] = useState<Column[]>([{ idx: 0, name: '' }]);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null) return;
    // Save board
    const boardRef = await addDoc(collection(db, "boards"), {
      name, 
      userId: user.uid, 
      createdAt: timestamp 
    });
    // Save columns
    const validColumns = columns.filter(({ name }) => name.trim() !== "");
    validColumns.forEach(async ({ name }) => {
      await addDoc(collection(db, "columns"), {
        name, 
        boardId: boardRef.id,
        userId: user.uid,
        createdAt: timestamp,
      });
    });

    // Set new board as selected
    dispatch(setSelectedBoardId(boardRef.id));
  });

  const updateColumnName = (idx: number, name: string) => {
    setColumns(prevColumns => {
      return prevColumns.map((column) => {
        if (column.idx === idx) return { ...column, name };
        return column;
      });
    });
  };

  const addColumn = () => {
    setColumns((prevColumns) => [...prevColumns, { idx: prevColumns.length, name: '' }]);
  };

  const deleteColumn = (idx: number) => {
    if (columns.length === 1) return;
    setColumns((prevColumns) => {
      const newColumns = prevColumns.filter((column) => column.idx !== idx);
      return newColumns.map((column, index) => ({ ...column, idx: index }));
    });
  };

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
        <h1 className="text-lg font-medium">Add New Board</h1>
        <div className="flex flex-col gap-3">
          {error && (
            <div className="auth-form-error-message">{formatFirebaseError(error)}</div>
          )}
          <input 
            type="text"
            className="text-input"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {columns.map(({ idx, name }) => (
            <div key={idx} className="flex items-center gap-3">
              <input 
                type="text"
                className="text-input"
                placeholder="Column"
                required
                value={name}
                onChange={(e) => updateColumnName(idx, e.target.value)}
              />
              {columns.length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteColumn(idx)} />}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <button 
            type="button" 
            className={`modal-form-light-btn ${loading ? "btn-loading" : " "}`}
            onClick={addColumn}
          >
            Add New Column
          </button>
          <button type="submit" className={`modal-form-btn ${loading ? "btn-loading" : ""}`}>
            Create New Board
          </button>
        </div>
      </form>
    </Modal>
  )
}