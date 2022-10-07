import { useRef } from 'react';
import useClickOutiside from '../../hooks/useClickOutiside';
import { useAppDispatch } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';

interface Props {
  children: React.ReactNode;
}

export default function Modal({ children }: Props) {
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutiside(modalRef, () => dispatch(hideModal()));

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center p-5">
      <div ref={modalRef} className="bg-gray-800 rounded-sm p-5 z-10 w-full sm:w-3/4 md:w-1/2 xl:w-1/4">{children}</div>
    </div>
  )
}