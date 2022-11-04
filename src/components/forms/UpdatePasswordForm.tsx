import { useState, useEffect, FormEvent } from 'react';
import useAsync from 'src/hooks/useAsync';
import { auth } from 'src/lib/firebase';
import { updatePassword } from 'firebase/auth';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import TextInput from 'src/components/common/TextInput';
import FormMessage from 'src/components/forms/FormMessage';

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
        <FormMessage variant="error">{passwordError}</FormMessage>
      )}
      {success && (
        <FormMessage variant="success">Your password has changed</FormMessage>
      )}
      <TextInput
        id="password"
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextInput 
        type="password"
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