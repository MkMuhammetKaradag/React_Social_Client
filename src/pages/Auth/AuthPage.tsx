import { useEffect, useState } from 'react';
import ResetPassword from '../../components/Auth/ResetPassword';
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import ForgotPassword from '../../components/Auth/ForgotPassword';
import Verification from '../../components/Auth/Verification';
import { useLocation } from 'react-router-dom';

enum AuthState {
  LOGIN = 'Login',
  REGISTER = 'Register',
  FORGOT_PASSWORD = 'Forgot-Password',
  VERIFICATION = 'Verification',
  RESET_PASSWORD = 'Reset-password',
}

const authComponents = {
  [AuthState.LOGIN]: Login,
  [AuthState.REGISTER]: Register,
  [AuthState.FORGOT_PASSWORD]: ForgotPassword,
  [AuthState.VERIFICATION]: Verification,
  [AuthState.RESET_PASSWORD]: ResetPassword,
};

function useVerifyCode() {
  const [verifyCode, setVerifyCode] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('verify');
    if (code) {
      setVerifyCode(code);
    }
  }, [location.search]);

  return verifyCode;
}

function AuthPage() {
  const [activeState, setActiveState] = useState<AuthState>(AuthState.LOGIN);
  const verifyCode = useVerifyCode();

  useEffect(() => {
    if (verifyCode) {
      setActiveState(AuthState.RESET_PASSWORD);
    }
  }, [verifyCode]);
  // Wrapper fonksiyon
  const handleSetActiveState = (route: string) => {
    setActiveState(route as AuthState);
  };
  const AuthComponent = authComponents[activeState];

  return (
    <div
      id="AuthPage"
      className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg">
        <AuthComponent
          setActiveState={handleSetActiveState}
          activationToken={verifyCode}
        />
        <div className="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
          <span className="text-[14px] text-gray-600">
            {activeState === AuthState.LOGIN
              ? "Don't have an account?"
              : 'Already have an account?'}
          </span>
          <button
            onClick={() =>
              setActiveState(
                activeState === AuthState.LOGIN
                  ? AuthState.REGISTER
                  : AuthState.LOGIN
              )
            }
            className="text-[14px] text-[#d44b69e1] font-semibold pl-1"
            aria-label={activeState === AuthState.LOGIN ? 'Sign up' : 'Log in'}
          >
            {activeState === AuthState.LOGIN ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
