import { useState, useEffect } from 'react';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import useAsync from '../../hooks/useAsync';

interface Props {
  onSuccess: () => void;
}

export default function ReauthenticateForm({ onSuccess }: Props) {
  const [password, setPassword] = useState<string>('');

  const { error, trigger, success, loading } = useAsync(async () => {
    if (auth.currentUser === null || auth.currentUser.email === null) return;
    const credentials = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credentials);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
  };

  useEffect(() => {
    if (success) onSuccess();
  }, [success]);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <h1 className="text-lg font-medium">Reauthenticate with password</h1>
      <div className="flex flex-col gap-3">
        {error && (
          <div className="auth-form-error-message">{formatFirebaseError(error)}</div>
        )}
        <input 
          type="password"
          className="text-input"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className={`w-full bg-purple-700 hover:bg-purple-800 transition-colors px-5 py-2 rounded-md font-medium ${loading ? "btn-loading" : ""}`}>
        Submit
      </button>
    </form>
  )
}