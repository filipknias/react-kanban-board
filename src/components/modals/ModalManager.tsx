import Modal from './Modal';
import { useAppSelector } from '../../redux/hooks';

export default function ModalManager() {
  const openedModal = useAppSelector((state) => state.modals.openedModal);
  return openedModal ? <Modal>{openedModal}</Modal> : null;
};