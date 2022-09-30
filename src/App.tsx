import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import routes from './utilities/routes';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.register} element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}