import { useState, useEffect, FormEvent } from 'react';
import useAsync from '../../hooks/useAsync';
import { auth } from '../../lib/firebase';
import { updatePassword } from 'firebase/auth';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';

export default function UpdatePasswordForm() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string|null>(null);

  const { error, loading, success, trigger } = useAsync(async () => {
    setPasswordError(null);
    if (auth.currentUser === null) return;
    await updatePassword(auth.currentUser, newPassword);
  });

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Confirm password validation
    if (newPassword !== confirmPassword) {
      return setPasswordError("Passwords must be the same");
    }
    trigger();
  };

  useEffect(() => {
    // Set password error message
    if (error === null) return;
    setPasswordError(formatFirebaseError(error));
  }, [error]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handlePasswordSubmit}>
      <label htmlFor="password" className="font-medium">Update Password</label>
      {passwordError && (
        <div className="auth-form-error-message">{passwordError}</div>
      )}
      {success && (
        <div className="auth-form-success-message">Your password has changed</div>
      )}
      <input
        id="password"
        type="password"
        className="text-input"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
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
      <button
        type="submit"
        className={`w-full bg-purple-700 hover:bg-purple-800 transition-colors px-5 py-2 rounded-md font-medium ${loading ? "btn-loading" : " "}`}
      >
        Update password
      </button>
    </form>
  )
}