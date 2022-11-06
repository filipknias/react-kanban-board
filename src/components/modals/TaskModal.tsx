import Modal from "src/components/modals/Modal";
import { Task } from "src/utilities/types";
import useSelectedBoard from 'src/hooks/useSelectedBoard';
import { useState, useEffect } from 'react';
import SubtasksList from 'src/components/app/SubtasksList';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from 'src/lib/firebase';
import { FaTrash, FaEdit } from 'react-icons/fa';
import useAsync from 'src/hooks/useAsync';
import { hideModal, openModal } from 'src/redux/features/modalsSlice';
import { useAppDispatch } from 'src/redux/hooks';
import EditTaskModal from 'src/components/modals/EditTaskModal';
import Button from "src/components/common/Button";
import SelectInput from "src/components/common/SelectInput";

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
            <Button 
              variant="info"
              disabled={loading}
              onClick={() => dispatch(openModal(<EditTaskModal task={task} />))}  
            >
              <FaEdit />
            </Button>
            <Button 
              variant="danger"
              disabled={loading}
              onClick={trigger}  
            >
              <FaTrash />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-400">{task.description ? task.description : "No description"}</p>
        {task.subtasks.length > 0 && <SubtasksList subtasks={task.subtasks} taskId={task.id} />}
        <div className="flex flex-col gap-2">
          <label htmlFor="column-id" className="font-medium">Current Status</label>
          <SelectInput 
            id="column-id"
            onChange={(e) => setColumnId(e.target.value)}
            value={columnId}
          >
            {columns.map((column) => (
              <option value={column.id} key={column.id}>{column.name}</option>
            ))}
          </SelectInput>
        </div>
      </div>
    </Modal>
  )
}