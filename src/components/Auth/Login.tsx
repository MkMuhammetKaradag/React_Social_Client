import React, { FC } from 'react';
type LoginProps = {
  setActiveState: (route: string) => void;
};
const Login: FC<LoginProps> = ({ setActiveState }) => {
  return <div>Login</div>;
};

export default Login;
