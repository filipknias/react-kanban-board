import { useState, useEffect, FormEvent } from 'react';
import useAsync from '../../hooks/useAsync';
import { auth } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { updateEmail } from 'firebase/auth';
import { updateEmail as updateEmailReduxAction } from '../../redux/features/authSlice';
import { useAppDispatch } from '../../redux/hooks';

export default function UpdateEmailForm() {
  const [email, setEmail] = useState<string>(auth.currentUser?.email || "");
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const dispatch = useAppDispatch();

  const { error, trigger, loading, success } = useAsync(async () => {
    if (auth.currentUser === null) return;
    // Update email
    await updateEmail(auth.currentUser, email);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (auth.currentUser?.email === email) {
      return setErrorMessage("Email is the same as it was before");
    }
    trigger();
  };

  useEffect(() => {
    if (auth.currentUser === null || auth.currentUser.email === null) return;
    // Update user state after success email change
    dispatch(updateEmailReduxAction(auth.currentUser.email));
  }, [success]);

  useEffect(() => {
    if (error === null) return;
    setErrorMessage(formatFirebaseError(error));
  }, [error]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label htmlFor="email" className="font-medium">Update E-mail Address</label>
      {errorMessage && (
        <div className="auth-form-error-message">{errorMessage}</div>
      )}
      {success && (
        <div className="auth-form-success-message">Your e-mail address has changed</div>
      )}
      <input
        id="email"
        type="text"
        className="text-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail address"
        required
      />
      <button
        type="submit"
        className={`w-full bg-purple-700 hover:bg-purple-800 transition-colors px-5 py-2 rounded-md font-medium ${loading ? "btn-loading" : " "}`}
      >
        Update e-mail
      </button>
    </form>
  )
}