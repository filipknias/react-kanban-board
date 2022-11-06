import Modal from 'src/components/modals/Modal';
import { useAppSelector } from 'src/redux/hooks';

export default function ModalManager() {
  const openedModal = useAppSelector((state) => state.modals.openedModal);
  return openedModal ? <Modal>{openedModal}</Modal> : null;
};