import Modal from "./Modal";
import { Task } from "../../utilities/types";
import useSelectedBoard from '../../hooks/useSelectedBoard';
import { useState, useEffect } from 'react';
import SubtasksList from '../app/SubtasksList';

interface Props {
  task: Task;
}

export default function TaskModal({ task }: Props) {
  const [columnId, setColumnId] = useState<string>(task.columnId);
  const { columns } = useSelectedBoard();

  useEffect(() => {
    updateColumnId(columnId);
  }, [columnId]);

  const updateColumnId = async (id: string) => {
    
  };

  return (
    <Modal>
      <div className="flex flex-col gap-5">
        <h1 className="text-lg font-medium">{task.name}</h1>
        <p className="text-sm text-gray-400">{task.description ? task.description : "No description"}</p>
        <SubtasksList subtasks={task.subtasks} taskId={task.id} />
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