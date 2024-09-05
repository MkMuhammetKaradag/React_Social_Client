import React, { FC } from 'react';
type VerificationProps = {
  setActiveState: (route: string) => void;
};

const Verification: FC<VerificationProps> = ({ setActiveState }) => {
  return <div>Verification</div>;
};

export default Verification;
