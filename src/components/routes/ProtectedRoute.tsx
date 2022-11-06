import { Navigate } from "react-router-dom";
import routes from "src/utilities/routes";

interface Props {
  isAuth: boolean;
  children: JSX.Element;
}

export default function ProtectedRoute({ isAuth, children }: Props) {
  if (isAuth) return children;
  return <Navigate to={routes.signIn} />
};