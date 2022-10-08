import Modal from "./Modal";
import { useAppDispatch } from "../../redux/hooks";
import BoardForm from "../forms/BoardForm";
import useSelectedBoard from '../../hooks/useSelectedBoard';
import { Board } from '../../utilities/types';
import { hideModal } from '../../redux/features/modalsSlice';
import { FaTrash } from 'react-icons/fa';
import useAsync from '../../hooks/useAsync';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useEffect } from 'react';
import { setSelectedBoardId } from '../../redux/features/dashboardSlice';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Props {
  board: Board;
}

export default function EditBoard({ board }: Props) {
  const dispatch = useAppDispatch();
  const { columns, tasks } = useSelectedBoard();

  const { loading, error, success, trigger } = useAsync(async () => {
    // Delete board
    const boardRef = doc(db, "boards", board.id);
    await deleteDoc(boardRef);
    // Delete columns
    columns.forEach(async (column) => {
      const columnRef = doc(db, "columns", column.id);
      await deleteDoc(columnRef);
    });
    // Delete tasks
    tasks.forEach(async (task) => {
      const taskRef = doc(db, "tasks", task.id);
      await deleteDoc(taskRef);
    });
  });
 
  useEffect(() => {
    if (success) {
      dispatch(setSelectedBoardId(null));
      dispatch(hideModal());
    }
  }, [success]);

  return (
    <Modal>
      <div className="flex flex-col gap-8">  
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-medium">Edit board</h1>
          {error && (
            <div className="auth-form-error-message">{formatFirebaseError(error)}</div>
          )}
          <BoardForm 
            action="update"
            onSuccess={() => dispatch(hideModal())}
            formData={{ board, columns, tasks }} 
          />
        </div>
        <button 
          className={`bg-red-500 rounded-sm flex items-center justify-center gap-2 py-2 px-4 font-medium transition-colors hover:bg-red-600 ${loading ? "btn-loading" : " "}`}
          onClick={trigger}
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </Modal>
  )
}