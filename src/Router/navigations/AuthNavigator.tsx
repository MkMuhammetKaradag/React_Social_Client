import { Route, Routes } from 'react-router-dom';
import AuthPage from '../../pages/Auth/AuthPage';

const AuthNavigator = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthPage />} />
    </Routes>
  );
};

export default AuthNavigator;
