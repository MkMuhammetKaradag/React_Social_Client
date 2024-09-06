import { useAppSelector } from '../context/hooks';
import AppNavigator from './navigations/AppNavigator';
import AuthNavigator from './navigations/AuthNavigator';

const Router = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector((s) => s.auth);

  return (
    <>
      {!isLoading && (
        <>
          {isAuthenticated && user ? (
            <AppNavigator></AppNavigator>
          ) : (
            <AuthNavigator></AuthNavigator>
          )}
        </>
      )}
    </>
  );
};

export default Router;
