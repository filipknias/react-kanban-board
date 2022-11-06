import Modal from "src/components/modals/Modal"
import { useAppDispatch } from 'src/redux/hooks';
import { hideModal } from 'src/redux/features/modalsSlice';
import TaskForm from 'src/components/forms/TaskForm';

export default function AddTaskModal() {
  const dispatch = useAppDispatch();

  return (
    <Modal>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">Add Task</h1>
        <TaskForm action="create" onSuccess={() => dispatch(hideModal())} />
      </div>
    </Modal>
  )
}