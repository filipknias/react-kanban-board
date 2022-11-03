import Logo from 'src/components/utilities/Logo';
import BoardsList from 'src/components/app/BoardsList';
import { useAppSelector } from 'src/redux/hooks';
import { BsXLg } from 'react-icons/bs';
import { useEffect, useRef } from 'react';
import useClickOutiside from 'src/hooks/useClickOutiside';
import NavigationAuthLinks from 'src/components/utilities/NavigationAuthLinks';

interface Props {
  open: boolean;
  hideMenu: () => void;
}

export default function MobileMenu({ open, hideMenu }: Props) {
  const boards = useAppSelector((state) => state.dashboard.boards); 
  const selectedBoardId = useAppSelector((state) => state.dashboard.selectedBoardId); 
  const bgRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    // Hide mobile menu on window resize
    window.addEventListener('resize', hideMenu);
    return () => window.removeEventListener('resize', hideMenu);
  }, []);

  useEffect(() => hideMenu, [selectedBoardId]);

  useClickOutiside(bgRef, hideMenu);

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-0 pointer-events-none ${open ? "opacity-100" : "opacity-0"}`}>
      <div 
        className={`fixed -left-full top-0 w-full sm:w-1/2 sm:-left-1/2 z-10 flex flex-col justify-between transition-transform bg-gray-800 h-full py-8 pointer-events-auto ${open ? "translate-x-full" : ""}`}
        ref={bgRef}  
      >
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between px-5">
            <Logo />
            <div 
              className="flex items-center justify-center p-2 rounded-sm bg-purple-500 text-white transition-colors hover:bg-purple-600 cursor-pointer"
              onClick={hideMenu}  
            >
              <BsXLg />
            </div>
          </div>
          <BoardsList boards={boards} />
        </div>
        <NavigationAuthLinks />
      </div>
    </div>
  )
}