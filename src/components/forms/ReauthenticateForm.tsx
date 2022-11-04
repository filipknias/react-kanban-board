import { useState, useEffect } from 'react';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from 'src/lib/firebase';
import useAsync from 'src/hooks/useAsync';
import TextInput from 'src/components/common/TextInput';
import FormMessage from 'src/components/forms/FormMessage';

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
          <FormMessage variant="error">
            {formatFirebaseError(error)}
          </FormMessage>
        )}
        <TextInput
          type="password"
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