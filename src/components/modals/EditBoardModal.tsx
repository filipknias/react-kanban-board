import Modal from "./Modal";
import { useAppDispatch } from "../../redux/hooks";
import BoardForm from "../forms/BoardForm";
import useSelectedBoard from '../../hooks/useSelectedBoard';
import { Board } from '../../utilities/types';
import { hideModal } from '../../redux/features/modalsSlice';

interface Props {
  board: Board;
}

export default function EditBoard({ board }: Props) {
  const dispatch = useAppDispatch();
  const { columns } = useSelectedBoard();

  return (
    <Modal>
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-medium">Edit board</h1>
        <BoardForm 
          action="update"
          onSuccess={() => dispatch(hideModal())}
          formData={{ board, columns }} 
        />
      </div>
    </Modal>
  )
}