import Logo from 'src/components/utilities/Logo';
import LoginForm from 'src/components/forms/LoginForm';

export default function Login() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8 px-5">
      <Logo />
      <LoginForm />
    </div>
  )
};