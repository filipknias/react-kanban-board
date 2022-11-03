import Logo from 'src/components/utilities/Logo';
import UpdateProfileForm from 'src/components/forms/UpdateProfileForm';

export default function Profile() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8 px-5">
      <Logo />
      <UpdateProfileForm />
    </div>
  )
}