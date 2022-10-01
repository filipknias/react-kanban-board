import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import GoogleButton from '../utilities/GoogleButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { Link } from 'react-router-dom';
import routes from '../../utilities/routes';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset state 
    setErrorMessage(null);
    setLoading(true);
    try {
      // Sign in user
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.log(err);
      setErrorMessage(formatFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
      
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center gap-3">
          <FaUserAlt />
          <h1 className="font-bold text-xl">Sign in to your account</h1>
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
          <Link to={routes.register} className="font-medium text-purple-500">
            Create new account
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