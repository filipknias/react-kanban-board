import { Task } from "../../utilities/types";
import Modal from './Modal';
import TaskForm from '../forms/TaskForm';
import { useAppDispatch } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';

interface Props {
  task: Task;
}

export default function EditTaskModal({ task }: Props) {
  const dispatch = useAppDispatch();

  return (
    <Modal>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">Edit Task</h1>
        <TaskForm 
          formData={task}
          action="update" 
          onSuccess={() => dispatch(hideModal())} 
        />
      </div>
    </Modal>
  )
}