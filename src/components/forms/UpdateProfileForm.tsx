import { useState } from 'react';
import UpdateEmailForm from 'src/components/forms//UpdateEmailForm';
import UpdatePasswordForm from 'src/components/forms//UpdatePasswordForm';
import ProfileFormButtons from 'src/components/forms//ProfileFormButtons';
import ReauthenticateForm from 'src/components/forms//ReauthenticateForm';

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