import React, { FC } from 'react';
type ResetPasswordProps = {
  activationToken: string | null;
  setActiveState: (route: string) => void;
};
const ResetPassword: FC<ResetPasswordProps> = ({
  setActiveState,
  activationToken,
}) => {
  console.log(activationToken);
  return <div>ResetPassword</div>;
};

export default ResetPassword;
