import { useAppSelector } from '../context/hooks';
import AppNavigator from './navigations/AppNavigator';
import AuthNavigator from './navigations/AuthNavigator';

const Router = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  return (
    <div className="flex flex-col min-h-screen items-center ">
      <header>
        <div>Nav Bar</div>
      </header>

      <div className="container justify-center ">
        {isAuthenticated && user ? (
          <AppNavigator></AppNavigator>
        ) : (
          <AuthNavigator></AuthNavigator>
        )}
      </div>
      <footer className="mt-auto flex bottom-0 left-0 w-full bg-gray-100 text-black p-4">
        <div>sdsdasdasdlnasjdh</div>
      </footer>
    </div>
  );
};

export default Router;
