import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import GoogleButton from '../utilities/GoogleButton';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { Link } from 'react-router-dom';
import routes from '../../utilities/routes';
import useAsync from '../../hooks/useAsync';

const provider = new GoogleAuthProvider();

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { loading, error, trigger } = useAsync(async () => {
    await signInWithEmailAndPassword(auth, email, password);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
  };

  const handleGoogleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center gap-3">
          <FaUserAlt />
          <h1 className="font-bold text-xl">Sign in to your account</h1>
        </div>
        <div className="flex flex-col gap-5">
          {error && (
            <div className="auth-form-error-message">{formatFirebaseError(error)}</div>
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
          <Link to={routes.register} className="auth-link">
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