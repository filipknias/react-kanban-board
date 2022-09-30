import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import GoogleButton from '../utilities/GoogleButton';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <div className="border-2 border-gray-700 rounded-sm p-3 flex items-center gap-2">
            <input type="checkbox" id="regulations-input" />
            <label htmlFor="regulations-input">Accept terms and regulations</label>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <button 
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 transition-colors px-5 py-2 rounded-md font-medium"
          >
            Submit
          </button>
          <GoogleButton onClick={handleGoogleLogin} />
        </div>
      </div>
    </form>
  )
};