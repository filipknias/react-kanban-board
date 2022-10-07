import { Subtask } from "../../utilities/types";
import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebase';

interface Props {
  subtasks: Subtask[];
  taskId: string;
}

export default function SubtasksList({ subtasks, taskId }: Props) {
  const [localSubtasks, setLocalSubtasks] = useState<Subtask[]>(subtasks);

  useEffect(() => {
    updateSubtasksDocs();
  }, [localSubtasks]);

  const updateSubtasksDocs = async () => {
    const taskRef = doc(db, "tasks", taskId);

    await updateDoc(taskRef, {
      subtasks: localSubtasks,
    });
  };

  const updateLocalSubtask = (idx: number) => {
    setLocalSubtasks((prevSubtasks) => {
      return prevSubtasks.map((task) => {
        if (task.idx === idx) return { ...task, done: !task.done };
        return task;
      })
    })
  };  

  return (
    <ul className="flex flex-col gap-2">
      {subtasks.map((subtask) => (
        <li 
          className="bg-gray-900 rounded-md p-2 flex items-center gap-2 transition-colors hover:bg-opacity-50 cursor-pointer" 
          key={subtask.idx}
          onClick={() => updateLocalSubtask(subtask.idx)}
        >
          <input 
            type="checkbox" 
            checked={localSubtasks[subtask.idx].done} 
            id={subtask.idx.toString()}
            onChange={() => updateLocalSubtask(subtask.idx)} 
          />
          <label htmlFor={subtask.idx.toString()} className={`font-medium ${localSubtasks[subtask.idx].done ? 'line-through' : ''}`}>
            {subtask.name}
          </label>
        </li>
      ))}
    </ul>
  )
}