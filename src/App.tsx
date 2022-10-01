import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import routes from './utilities/routes';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { signIn, logout } from './redux/features/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import ModalManager from './components/modals/ModalManager';

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuth = Boolean(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(signIn({ uid, email, displayName }));
      } else dispatch(logout());
    });

    return () => unsubscribe();
  }, []);
  
  return (
    <BrowserRouter>
      <ModalManager />
      <Routes>
        <Route path={routes.index} element={<ProtectedRoute isAuth={isAuth}><Dashboard /></ProtectedRoute>} />
        <Route path={routes.register} element={<PublicRoute isAuth={isAuth}><Register /></PublicRoute>} />
        <Route path={routes.signIn} element={<PublicRoute isAuth={isAuth}><Login /></PublicRoute>} />
      </Routes>
    </BrowserRouter>
  );
}