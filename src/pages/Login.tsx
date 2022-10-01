import Logo from '../components/utilities/Logo';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <Logo />
      <LoginForm />
    </div>
  )
};