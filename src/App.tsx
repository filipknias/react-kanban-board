import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import routes from './utilities/routes';
import Register from './pages/Register';
import { signIn, logout } from './redux/features/authSlice';
import { useAppDispatch } from './redux/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) dispatch(signIn(user));
      else dispatch(logout());
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.register} element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}