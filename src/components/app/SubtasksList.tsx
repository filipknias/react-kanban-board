import { Subtask } from "src/utilities/types";
import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'src/lib/firebase';

interface Props {
  subtasks: Subtask[];
  taskId: string;
}

export default function SubtasksList({ subtasks, taskId }: Props) {
  const [subtasksList, setSubtasksList] = useState<Subtask[]>(subtasks);

  useEffect(() => {
    updateSubtasksDocs();
  }, [subtasksList]);

  const updateSubtasksDocs = async () => {
    const taskRef = doc(db, "tasks", taskId);

    await updateDoc(taskRef, {
      subtasks: subtasksList,
    });
  };

  const updateSubtasksList = (idx: number) => {
    setSubtasksList((prevSubtasks) => {
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
<<<<<<< HEAD
          className="bg-gray-900 rounded-md p-2 flex items-center gap-2" 
=======
          className="bg-gray-900 rounded-md p-2 flex items-center gap-2 transition-colors" 
>>>>>>> dev
          key={subtask.idx}
        >
          <input 
            type="checkbox" 
            checked={subtasksList[subtask.idx].done} 
            id={subtask.idx.toString()}
<<<<<<< HEAD
            onChange={() => updateLocalSubtask(subtask.idx)}
=======
            onChange={() => updateSubtasksList(subtask.idx)} 
>>>>>>> dev
          />
          <label htmlFor={subtask.idx.toString()} className={`font-medium ${subtasksList[subtask.idx].done ? 'line-through' : ''}`}>
            {subtask.name}
          </label>
        </li>
      ))}
    </ul>
  )
}