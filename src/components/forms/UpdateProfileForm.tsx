import { useState } from 'react';
import UpdateEmailForm from './UpdateEmailForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import ProfileFormButtons from './ProfileFormButtons';
import ReauthenticateForm from './ReauthenticateForm';

export default function UpdateProfileForm() {
  const [reauthenticated, setReauthenticated] = useState(false);

  return (
    <div className="auth-form-container">
      <div className="flex flex-col gap-12">
        {reauthenticated ? (
          <>
            <UpdateEmailForm />
            <UpdatePasswordForm />
            <ProfileFormButtons />
          </>
        ) : (
          <ReauthenticateForm onSuccess={() => setReauthenticated(true)} />
        )}
      </div>
    </div>
  )
}