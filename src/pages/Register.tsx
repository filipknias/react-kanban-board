import Logo from '../components/utilities/Logo';
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8 px-5">
      <Logo />
      <RegisterForm />
    </div>
  )
};