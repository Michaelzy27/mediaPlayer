import NotFoundPage from 'components/page/404';
import AuthedApp from 'components/page/AuthedApp';
import LoginApp from 'components/page/LoginApp';
import { Route, Routes } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const App = () => {
  // TODO: connect authentication
  const authed = true;
  return authed ? (
    <AuthedApp />
  ) : (
    <Routes>
      <Route key={`route-404`} path="/404" element={<NotFoundPage />} />
      <Route key={`route-login`} path={`/*`} element={<LoginApp />} />
    </Routes>
  );
};

export default App;
