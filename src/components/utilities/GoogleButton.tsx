import { FaGoogle } from 'react-icons/fa';

interface Props {
  onClick: () => void;
}

export default function GoogleButton({ onClick }: Props) {
  return (
    <button 
      type="button"
      className="flex items-center justify-center gap-3 rounded-lg px-5 py-2 bg-gray-600 hover:bg-gray-700 shadow-sm font-medium transition-colors"
      onClick={onClick}  
    >
      <FaGoogle />
      Sign in with google
    </button>
  )
};