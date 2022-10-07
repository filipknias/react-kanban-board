import Modal from "./Modal";
import { Task } from "../../utilities/types";
import useSelectedBoard from '../../hooks/useSelectedBoard';
import { useState, useEffect } from 'react';
import SubtasksList from '../app/SubtasksList';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { FaTrash, FaEdit } from 'react-icons/fa';
import useAsync from '../../hooks/useAsync';
import { hideModal, openModal } from '../../redux/features/modalsSlice';
import { useAppDispatch } from '../../redux/hooks';
import EditTaskModal from './EditTaskModal';

interface Props {
  task: Task;
}

export default function TaskModal({ task }: Props) {
  const [columnId, setColumnId] = useState<string>(task.columnId);
  const { columns } = useSelectedBoard();
  const dispatch = useAppDispatch();

  const { trigger, success, loading } = useAsync(async () => {
    const taskRef = doc(db, "tasks", task.id);
    await deleteDoc(taskRef);
  });

  useEffect(() => {
    updateColumnId(columnId);
  }, [columnId]);

  useEffect(() => {
    if (success) dispatch(hideModal());
  }, [success]);

  const updateColumnId = async (id: string) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, { columnId: id });
  };

  return (
    <Modal>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">{task.name}</h1>
          <div className="flex gap-3">
            <button 
              className={`bg-blue-500 p-2 flex items-center justify-center text-white text-sm rounded-sm transition-colors hover:bg-blue-600 ${loading ? "btn-loading" : " "}`}
              onClick={() => dispatch(openModal(<EditTaskModal task={task} />))}  
            >
              <FaEdit />
            </button>
            <button 
              className={`bg-red-500 p-2 flex items-center justify-center text-white text-sm rounded-sm transition-colors hover:bg-red-600 ${loading ? "btn-loading" : " "}`}
              onClick={trigger}  
            >
              <FaTrash />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-400">{task.description ? task.description : "No description"}</p>
        {task.subtasks.length > 0 && <SubtasksList subtasks={task.subtasks} taskId={task.id} />}
        <div className="flex flex-col gap-2">
          <label htmlFor="column-id" className="font-medium">Current Status</label>
          <select 
            id="column-id" 
            className="select-input"
            onChange={(e) => setColumnId(e.target.value)}
            value={columnId}
          >
            {columns.map((column) => (
              <option value={column.id} key={column.id}>{column.name}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  )
}