import { useState, useEffect } from 'react';
import { Board, SubmitAction, Column } from "../../utilities/types";
import { BsXLg } from 'react-icons/bs';
import useAsync from '../../hooks/useAsync';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db, timestamp } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSelectedBoardId } from '../../redux/features/dashboardSlice';
interface FormData {
  board: Board;
  columns: Column[];
}

interface Props {
  formData?: FormData;
  action: SubmitAction;
  onSuccess?: () => void;
}

interface LocalColumn {
  idx: number;
  name: string;
}

export default function BoardForm({ formData, action, onSuccess }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>(() => formData?.board.name || '');
  const [localColumns, setLocalColumns] = useState<LocalColumn[]>(() => {
    if (formData) return formData.columns.map((column, index) => ({ idx: index, name: column.name }));
    return [{ idx: 0, name: '' }];
  });

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null) return;
    const validColumns = localColumns.filter(({ name }) => name.trim() !== "");

    switch (action) {
      case "create": {
        // Save board
        const boardRef = await addDoc(collection(db, "boards"), {
          name, 
          userId: user.uid, 
          createdAt: timestamp 
        });
        // Save columns
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
        break;
      };
      case "update": {
        // if (formData === undefined) return;
        // const boardRef = doc(db, "boards", formData.id);
        // // Update board data
        // await updateDoc(boardRef, { name });
        // // Update columns data
        // localColumns.forEach(async (column) => {
        //   const columnRef = doc(db, "columns", )
        // });
        break;
      }
    }
  });

  useEffect(() => {
    if (onSuccess === undefined) return;
    if (success) onSuccess();
  }, [success]);

  const updateColumnName = (idx: number, name: string) => {
    setLocalColumns(prevColumns => {
      return prevColumns.map((column) => {
        if (column.idx === idx) return { ...column, name };
        return column;
      });
    });
  };

  const addColumn = () => {
    setLocalColumns((prevColumns) => [...prevColumns, { idx: prevColumns.length, name: '' }]);
  };

  const deleteColumn = (idx: number) => {
    if (localColumns.length === 1) return;
    setLocalColumns((prevColumns) => {
      const newColumns = prevColumns.filter((column) => column.idx !== idx);
      return newColumns.map((column, index) => ({ ...column, idx: index }));
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
        {localColumns.map(({ idx, name }) => (
          <div key={idx} className="flex items-center gap-3">
            <input 
              type="text"
              className="text-input"
              placeholder="Column"
              value={name}
              onChange={(e) => updateColumnName(idx, e.target.value)}
            />
            {localColumns.length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteColumn(idx)} />}
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
          Save
        </button>
      </div>
    </form>
  )
}