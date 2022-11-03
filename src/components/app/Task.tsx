import { Task as TaskType } from "src/utilities/types";
import { useMemo } from 'react';
import { useAppDispatch } from 'src/redux/hooks';
import { openModal } from 'src/redux/features/modalsSlice';
import TaskModal from 'src/components/modals/TaskModal';

interface Props {
  task: TaskType;
}

export default function Task({ task }: Props) {
  const dispatch = useAppDispatch();

  const doneTasks = useMemo(() => {
    return task.subtasks.filter((subtask) => subtask.done);
  }, [task]);

  return (
    <div 
      className="bg-gray-700 rounded-md p-3 cursor-pointer transition-colors hover:bg-gray-600 flex flex-col gap-1"
      onClick={() => dispatch(openModal(<TaskModal task={task} />))}  
    >
      <h1 className="font-medium text-lg">{task.name}</h1>
      <p className="font-medium text-sm text-gray-400">{doneTasks.length} of {task.subtasks.length} subtasks</p>
    </div>
  )
};