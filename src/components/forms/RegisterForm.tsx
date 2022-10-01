import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import GoogleButton from '../utilities/GoogleButton';
import { createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { Link } from 'react-router-dom';
import routes from '../../utilities/routes';

export default function RegisterForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [regulationsAccepted, setRegulationsAccepted] = useState<boolean>(false);
  const [isRegulationsError, setIsRegulationsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset state
    setIsRegulationsError(false);
    setErrorMessage(null);
    setLoading(true);
    try {
      // Client validation
      if (!regulationsAccepted) {
        setIsRegulationsError(true);
        return setErrorMessage("Terms and regulations must be accepted");
      }
      if (password !== confirmPassword) {
        return setErrorMessage("Passwords must be the same");
      }
      // Create user
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.log(err.code);
      setErrorMessage(formatFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center gap-3">
          <FaUserAlt />
          <h1 className="font-bold text-xl">Create new account</h1>
        </div>
        <div className="flex flex-col gap-5">
          {errorMessage && (
            <div className="auth-form-error-message">{errorMessage}</div>
          )}
          <input
            type="email"
            className="text-input"
            placeholder="E-mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="text-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="text-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className={`rounded-sm p-3 flex items-center gap-2 border-2 ${isRegulationsError ? 'border-red-700' : 'border-gray-700'}`}>
            <input 
              type="checkbox" 
              id="regulations-input" 
              checked={regulationsAccepted}
              onChange={(e) => setRegulationsAccepted(e.target.checked)} 
            />
            <label htmlFor="regulations-input">Accept terms and regulations</label>
          </div>
          <Link to={routes.signIn} className="font-medium text-purple-500">
            Sign in to your account
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <button 
            type="submit"
            className={`w-full bg-purple-700 hover:bg-purple-800 transition-colors px-5 py-2 rounded-md font-medium ${loading ? "btn-loading" : " "}`}
          >
            Submit
          </button>
          <GoogleButton onClick={handleGoogleLogin} />
        </div>
      </div>
    </form>
  )
};