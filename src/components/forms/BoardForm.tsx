import { useState, useEffect } from 'react';
import { Board, SubmitAction, Column, Task } from "src/utilities/types";
import { BsXLg } from 'react-icons/bs';
import useAsync from 'src/hooks/useAsync';
import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, timestamp } from 'src/lib/firebase';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setSelectedBoardId } from 'src/redux/features/dashboardSlice';
import { User } from 'src/redux/features/authSlice';
import TextInput from 'src/components/utilities/TextInput';

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

  const createBoard = async (user: User, columns: NewColumn[]) => {
    // Save board
    const boardRef = await addDoc(collection(db, "boards"), {
      name, 
      userId: user.uid, 
      createdAt: timestamp 
    });
    // Save columns
    columns.forEach(async ({ name }) => {
      await addDoc(collection(db, "columns"), {
        name, 
        boardId: boardRef.id,
        userId: user.uid,
        createdAt: timestamp,
      });
    });
    // Return saved board reference
    return boardRef;
  };

  const updateBoardData = async (user: User, newColumns: NewColumn[]) => {
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
    newColumns.forEach(async (column) => {
      const boardId = formData.board.id;
      await addDoc(collection(db, "columns"), {
        name: column.name,
        boardId,
        userId: user.uid,
        createdAt: timestamp,
      });
    });
  };

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null) return;
    const validColumns = newColumns.filter(({ name }) => name.trim() !== "");

    switch (action) {
      case "create": {
        // Create new board
        const boardRef = await createBoard(user, validColumns);
        // Set new board as selected
        dispatch(setSelectedBoardId(boardRef.id));
        break;
      };
      case "update": {
        // Edit board data
        updateBoardData(user, validColumns);
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
        <TextInput
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
          {formDataColumns.map(({ id, name }) => (
            <div key={id} className="flex items-center gap-3">
              <TextInput
                type="text"
                placeholder="Column"
                value={name}
                onChange={(e) => updateFormDataColumnName(id, e.target.value)}
              />
              {[...newColumns, ...formDataColumns].length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteFormDataColumn(id)} />}
            </div>
          ))}
          {newColumns.map(({ idx, name }) => (
            <div key={idx} className="flex items-center gap-3">
              <TextInput
                type="text"
                placeholder="Column"
                value={name}
                onChange={(e) => updateNewColumnName(idx, e.target.value)}
              />
              {[...newColumns, ...formDataColumns].length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteNewColumn(idx)} />}
            </div>
          ))}
        </div>
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