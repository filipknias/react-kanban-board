import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { openModal } from '../../redux/features/modalsSlice';
import ReauthenticateModal from '../modals/ReauthenticateModal';
import UpdateEmailForm from './UpdateEmailForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import ProfileFormButtons from './ProfileFormButtons';

export default function UpdateProfileForm() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Reauthenticate user
    dispatch(openModal(<ReauthenticateModal />));
  }, []);

  return (
    <div className="auth-form-container">
      <div className="flex flex-col gap-12">
        <UpdateEmailForm />
        <UpdatePasswordForm />
        <ProfileFormButtons />
      </div>
    </div>
  )
}