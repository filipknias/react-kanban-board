import Modal from "src/components/modals/Modal";
import { useAppDispatch } from 'src/redux/hooks';
import { hideModal } from 'src/redux/features/modalsSlice';
import BoardForm from 'src/components/forms/BoardForm';

export default function CreateBoardModal() {
  const dispatch = useAppDispatch();

  return (
    <Modal>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">Add New Board</h1>
        <BoardForm action="create" onSuccess={() => dispatch(hideModal())} />
      </div>
    </Modal>
  )
}