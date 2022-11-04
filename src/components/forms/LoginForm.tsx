import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import GoogleButton from 'src/components/common/GoogleButton';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from 'src/lib/firebase';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import { Link } from 'react-router-dom';
import routes from 'src/utilities/routes';
import useAsync from 'src/hooks/useAsync';
import TextInput from 'src/components/common/TextInput';
import FormContainer from 'src/components/forms/FormContainer';
import FormMessage from 'src/components/forms/FormMessage';
import Button from "src/components/common/Button";

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
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-center gap-3">
            <FaUserAlt />
            <h1 className="font-bold text-xl">Sign in to your account</h1>
          </div>
          <div className="flex flex-col gap-5">
            {error && (
              <FormMessage variant="error">
                {formatFirebaseError(error)}
              </FormMessage>
            )}
            <TextInput
              type="email"
              placeholder="E-mail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextInput
              type="password"
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
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
            <GoogleButton onClick={handleGoogleLogin} />
          </div>
        </div>
      </form>
    </FormContainer>
  )
};