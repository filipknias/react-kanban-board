import Modal from "src/components/modals/Modal";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import BoardForm from "src/components/forms/BoardForm";
import useSelectedBoard from 'src/hooks/useSelectedBoard';
import { Board } from 'src/utilities/types';
import { hideModal } from 'src/redux/features/modalsSlice';
import { FaTrash } from 'react-icons/fa';
import useAsync from 'src/hooks/useAsync';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import { useEffect } from 'react';
import { setSelectedBoardId } from 'src/redux/features/dashboardSlice';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/lib/firebase';

interface Props {
  board: Board;
}

export default function EditBoard({ board }: Props) {
  const boards = useAppSelector((state) => state.dashboard.boards);
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
      // Set first board as selected if it exists
      if (boards.length > 0) dispatch(setSelectedBoardId(boards[0].id))
      else dispatch(setSelectedBoardId(null));
      // Hide modal
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