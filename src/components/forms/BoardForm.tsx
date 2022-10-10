import { useState, useEffect } from 'react';
import { Board, SubmitAction, Column, Task } from "../../utilities/types";
import { BsXLg } from 'react-icons/bs';
import useAsync from '../../hooks/useAsync';
import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, timestamp } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSelectedBoardId } from '../../redux/features/dashboardSlice';

interface FormData {
  board: Board;
  columns: Column[];
  tasks: Task[];
}

interface Props {
  formData?: FormData;
  action: SubmitAction;
  onSuccess?: () => void;
}

interface NewColumn {
  idx: number;
  name: string;
}

export default function BoardForm({ formData, action, onSuccess }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>(() => formData?.board.name || '');
  // New added in form columns
  const [newColumns, setNewColumns] = useState<NewColumn[]>([{ idx: 0, name: '' }]);
  // Columns from formData props
  const [formDataColumns, setFormDataColumns] = useState<Column[]>(formData?.columns || []);

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null) return;
    const validColumns = newColumns.filter(({ name }) => name.trim() !== "");

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
        if (formData === undefined) return;
        // Update board data
        const boardRef = doc(db, "boards", formData.board.id);
        await updateDoc(boardRef, { name });
        // Update columns data
        formData.columns.forEach(async (column) => {
          const columnRef = doc(db, "columns", column.id);
          // Check if column was deleted
          const formDataColumn = formDataColumns.find((c) => c.id === column.id);
          if (!formDataColumn) {
            // Delete column and tasks
            await deleteDoc(columnRef); 
            formData.tasks.forEach(async (task) => {
              const taskRef = doc(db, "tasks", task.id);
              await deleteDoc(taskRef);
            });
          }
        });
        // Update name changes
        formDataColumns.forEach(async (column) => {
          const columnRef = doc(db, "columns", column.id);
          await updateDoc(columnRef, { name: column.name });
        });
        // Save new columns in firestore
        validColumns.forEach(async (column) => {
          const boardId = formData.board.id;
          await addDoc(collection(db, "columns"), {
            name: column.name,
            boardId,
            userId: user.uid,
            createdAt: timestamp,
          });
        });
        break;
      };
    }
  });

  useEffect(() => {
    if (onSuccess === undefined) return;
    if (success) onSuccess();
  }, [success]);

  const updateNewColumnName = (idx: number, name: string) => {
    setNewColumns(prevColumns => {
      return prevColumns.map((column) => {
        if (column.idx === idx) return { ...column, name };
        return column;
      });
    });
  };

  const updateFormDataColumnName = (id: string, name: string) => {
    setFormDataColumns(prevColumns => {
      return prevColumns.map((column) => {
        if (column.id === id) return { ...column, name };
        return column;
      });
    });
  };

  const addNewColumn = () => {
    setNewColumns((prevColumns) => [...prevColumns, { idx: prevColumns.length, name: '' }]);
  };

  const deleteNewColumn = (idx: number) => {
    setNewColumns((prevColumns) => {
      const newColumns = prevColumns.filter((column) => column.idx !== idx);
      return newColumns.map((column, index) => ({ ...column, idx: index }));
    });
  };

  const deleteFormDataColumn = (id: string) => {
    setFormDataColumns((prevColumns) => prevColumns.filter((column) => column.id !== id));
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
        {formDataColumns.map(({ id, name }) => (
          <div key={id} className="flex items-center gap-3">
            <input 
              type="text"
              className="text-input"
              placeholder="Column"
              value={name}
              onChange={(e) => updateFormDataColumnName(id, e.target.value)}
            />
            {[...newColumns, ...formDataColumns].length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteFormDataColumn(id)} />}
          </div>
        ))}
        {newColumns.map(({ idx, name }) => (
          <div key={idx} className="flex items-center gap-3">
            <input 
              type="text"
              className="text-input"
              placeholder="Column"
              value={name}
              onChange={(e) => updateNewColumnName(idx, e.target.value)}
            />
            {[...newColumns, ...formDataColumns].length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteNewColumn(idx)} />}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button 
          type="button" 
          className={`modal-form-light-btn ${loading ? "btn-loading" : " "}`}
          onClick={addNewColumn}
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