import Modal from "./Modal"
import { useAppDispatch } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';
import TaskForm from '../forms/TaskForm';

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