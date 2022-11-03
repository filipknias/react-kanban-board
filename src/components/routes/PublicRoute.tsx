import { Navigate } from "react-router-dom";
import routes from "src/utilities/routes";

interface Props {
  isAuth: boolean;
  children: JSX.Element;
}

export default function PublicRoute({ isAuth, children }: Props) {
  if (isAuth) return <Navigate to={routes.index} />
  return children;
};