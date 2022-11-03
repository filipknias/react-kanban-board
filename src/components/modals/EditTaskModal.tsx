import { Task } from "src/utilities/types";
import Modal from 'src/components/modals/Modal';
import TaskForm from 'src/components/forms/TaskForm';
import { useAppDispatch } from 'src/redux/hooks';
import { hideModal } from 'src/redux/features/modalsSlice';

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