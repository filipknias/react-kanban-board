import Modal from './Modal';
import { useState, useEffect } from 'react';
import useAsync from '../../hooks/useAsync';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useAppDispatch } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';

export default function ReauthenticateModal() {
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();

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
    if (success) dispatch(hideModal());
  }, [success]);

  return (
    <Modal>
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
        <button type="submit" className={`modal-form-btn ${loading ? "btn-loading" : ""}`}>
          Submit
        </button>
      </form>
    </Modal>
  )
}